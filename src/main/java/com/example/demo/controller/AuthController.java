package com.example.demo.controller;

import com.example.demo.dto.UserProfileDTO;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.entity.UserProfile;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserProfileRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserProfileRepository userProfileRepository;
    private final AuthenticationManager authenticationManager;

    public AuthController(
            AuthService authService,
            UserRepository userRepository,
            RoleRepository roleRepository,
            UserProfileRepository userProfileRepository,
            AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userProfileRepository = userProfileRepository;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    private Map<String, Object> buildUserResponse(User user, String message) {
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        response.put("fullName", user.getFullName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        response.put("roles", roleNames);
        return response;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        logger.info("Login attempt: email={}, sessionId={}", request.getEmail(), httpRequest.getSession().getId());
        try {
            Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
            if (!userOptional.isPresent()) {
                logger.warn("User not found for email: {}", request.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Email không tồn tại"));
            }
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            httpRequest.getSession(true);
            User user = userOptional.get();
            logger.info("Login successful: email={}, authorities={}, sessionId={}",
                    request.getEmail(), authentication.getAuthorities(), httpRequest.getSession().getId());
            return ResponseEntity.ok(buildUserResponse(user, "Đăng nhập thành công"));
        } catch (Exception e) {
            logger.error("Login failed for email={}: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Email hoặc mật khẩu không hợp lệ"));
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        logger.info("Logout attempt: sessionId={}", request.getSession().getId());
        SecurityContextHolder.clearContext();
        request.getSession().invalidate();
        logger.info("Logout successful: session invalidated");
        return ResponseEntity.ok(Map.of("message", "Đăng xuất thành công"));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(Authentication authentication, HttpServletRequest request) {
        logger.info("Fetching current user: authentication={}, sessionId={}", authentication, request.getSession().getId());
        logger.info("Request cookies: {}", request.getHeader("Cookie"));
        logger.info("SecurityContext before check: {}", SecurityContextHolder.getContext());
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            logger.warn("User not authenticated, SecurityContext={}", SecurityContextHolder.getContext());
            return new ResponseEntity<>(Map.of("message", "Not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        String principal = authentication.getName();
        logger.info("Principal from authentication: {}", principal);
        Optional<User> userOptional = userRepository.findByEmail(principal);
        if (!userOptional.isPresent()) {
            logger.info("User not found by email, trying username: {}", principal);
            userOptional = userRepository.findByUsername(principal); // Tìm bằng username
        }
        if (!userOptional.isPresent()) {
            logger.warn("User not found for principal: {}", principal);
            return new ResponseEntity<>(Map.of("message", "User not found for principal: " + principal), HttpStatus.NOT_FOUND);
        }
        User user = userOptional.get();
        logger.info("User fetched successfully: email={}", user.getEmail());
        return ResponseEntity.ok(buildUserResponse(user, "Lấy thông tin người dùng thành công"));
    }

    @GetMapping("/profile")
    @Transactional
    public ResponseEntity<?> getProfile(@RequestParam String email) {
        logger.info("Fetching profile for email={}", email);
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

            UserProfile profile = user.getUserProfile();
            if (profile == null) {
                profile = new UserProfile();
                Long userId = user.getId();
                if (userId == null) {
                    logger.error("User ID is null for email={}", email);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("message", "User ID is null"));
                }
                logger.info("Setting userId={} for new profile", userId);
                profile.setUser(user);
                List<String> roleNames = user.getRoles().stream()
                        .map(Role::getRoleName)
                        .collect(Collectors.toList());
                String userType = roleNames.contains("Student") ? "Student" :
                        roleNames.contains("Member") ? "Member" :
                                roleNames.contains("Parent") ? "Parent" :
                                        roleNames.contains("Teacher") ? "Teacher" : "Guest";
                profile.setUserType(userType);
                user.setUserProfile(profile);
                userProfileRepository.save(profile);
                logger.info("Created default profile for user_id={}", userId);
            }

            return ResponseEntity.ok(new UserProfileDTO(user, profile));
        } catch (Exception e) {
            logger.error("Failed to fetch profile for email={}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch profile: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, BindingResult bindingResult) {
        logger.info("Register attempt: email={}", request.getEmail());
        if (bindingResult.hasErrors()) {
            String errorMsg = bindingResult.getFieldError() != null ? bindingResult.getFieldError().getDefaultMessage() : "Dữ liệu không hợp lệ";
            logger.warn("Registration failed: validation error - {}", errorMsg);
            return ResponseEntity.badRequest().body(errorMsg);
        }

        try {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                logger.warn("Registration failed: Email already in use - {}", request.getEmail());
                return ResponseEntity.badRequest().body("Email đã được sử dụng");
            }
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                logger.warn("Registration failed: Username already in use - {}", request.getUsername());
                return ResponseEntity.badRequest().body("Tên đăng nhập đã được sử dụng");
            }

            Role userRole = roleRepository.findByRoleName("Member")
                    .orElseGet(() -> roleRepository.save(new Role(null, "Member", "Thành viên đã đăng ký, có quyền truy cập khóa học và khảo sát")));

            User newUser = new User();
            newUser.setUsername(request.getUsername());
            newUser.setEmail(request.getEmail());
            newUser.setFullName(request.getFullName());
            newUser.setPhone(request.getPhone());
            newUser.setStatus(1);
            newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            newUser.setLoginType("standard");

            Set<Role> roles = new HashSet<>();
            roles.add(userRole);
            newUser.setRoles(roles);

            User savedUser = userRepository.saveAndFlush(newUser);
            if (savedUser == null || savedUser.getId() == null) {
                logger.error("Failed to retrieve user ID after saving user: email={}", request.getEmail());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Failed to retrieve user ID after registration"));
            }
            logger.info("User registered successfully: email={}, user_id={}", request.getEmail(), savedUser.getId());

            UserProfile userProfile = new UserProfile();
            userProfile.setUser(savedUser);
            userProfile.setUserType("Member");
            savedUser.setUserProfile(userProfile);
            userProfileRepository.save(userProfile);
            logger.info("User profile created for user_id={}", savedUser.getId());

            return ResponseEntity.ok("Tạo tài khoản thành công");
        } catch (Exception e) {
            logger.error("Registration failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @PostMapping("/login-google")
    @Transactional
    public ResponseEntity<?> loginGoogle(@RequestBody GoogleLoginRequest request, HttpServletRequest httpRequest) {
        logger.info("Google login attempt: token={}", request.getIdToken());
        try {
            Payload payload = authService.verifyGoogleToken(request.getIdToken());
            if (payload == null) {
                logger.warn("Google login failed: Invalid token");
                return ResponseEntity.status(401).body("Token Google không hợp lệ");
            }
            String email = payload.getEmail();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                Role userRole = roleRepository.findByRoleName("Student")
                        .orElseGet(() -> roleRepository.save(new Role(null, "Student", "Thành viên đã đăng ký")));
                user = new User();
                user.setEmail(email);
                user.setUsername(email);
                user.setFullName((String) payload.get("name"));
                user.setStatus(1);
                user.setPasswordHash("");
                user.setLoginType("google");
                Set<Role> roles = new HashSet<>();
                roles.add(userRole);
                user.setRoles(roles);
                user = userRepository.saveAndFlush(user);
                UserProfile userProfile = new UserProfile();
                userProfile.setUser(user);
                userProfile.setUserType("Student");
                user.setUserProfile(userProfile);
                userProfileRepository.save(userProfile);
                logger.info("New user created via Google login: email={}, user_id={}", email, user.getId());
            }
            List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getRoleName()))
                    .collect(Collectors.toList());
            Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            httpRequest.getSession(true); // Khởi tạo session
            logger.info("Google login successful: email={}, sessionId={}", email, httpRequest.getSession().getId());
            return ResponseEntity.ok(buildUserResponse(user, "Đăng nhập thành công"));
        } catch (Exception e) {
            logger.error("Google login failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}