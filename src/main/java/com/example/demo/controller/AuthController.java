package com.example.demo.controller;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(AuthService authService, UserRepository userRepository, RoleRepository roleRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isEmpty() ||
                request.getPassword() == null || request.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Email và mật khẩu không được để trống");
        }

        boolean auth = authService.authenticate(request.getEmail(), request.getPassword());
        if (auth) {
            return ResponseEntity.ok("Đăng nhập thành công");
        } else {
            return ResponseEntity.status(401).body("Email hoặc mật khẩu không hợp lệ");
        }
    }

    // API đăng ký tài khoản
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, BindingResult bindingResult) {
        // Kiểm tra validation lỗi
        if (bindingResult.hasErrors()) {
            // Lấy message lỗi đầu tiên trả về client
            String errorMsg = bindingResult.getFieldError().getDefaultMessage();
            return ResponseEntity.badRequest().body(errorMsg);
        }

        try {
            // Kiểm tra email và username tồn tại
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email đã được sử dụng");
            }
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("Tên đăng nhập đã được sử dụng");
            }

            // Lấy role USER mặc định
            Role userRole = roleRepository.findByRoleName("Member")
                    .orElseGet(() -> roleRepository.save(new Role(null, "Member", "Thành viên đã đăng ký, có quyền truy cập khóa học và khảo sát")));


            // Tạo user mới
            User newUser = new User();
            newUser.setUsername(request.getUsername());
            newUser.setEmail(request.getEmail());
            newUser.setFullName(request.getFullName());
            newUser.setPhone(request.getPhone());
            newUser.setRole(userRole);
            newUser.setStatus(1);
            newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));

            userRepository.save(newUser);

            return ResponseEntity.ok("Tạo tài khoản thành công");
        } catch (Exception e) {
            // Xử lý ngoại lệ khi lưu dữ liệu
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }
    @PostMapping("/login-google")
    public ResponseEntity<?> loginGoogle(@RequestBody GoogleLoginRequest request) {
        try {
            // Verify token với service bạn đã tạo (GoogleTokenVerifierService)
            Payload payload = authService.verifyGoogleToken(request.getIdToken());

            if (payload == null) {
                return ResponseEntity.status(401).body("Token Google không hợp lệ");
            }

            String email = payload.getEmail();

            // Tìm user theo email
            Optional<User> userOpt = userRepository.findByEmail(email);

            User user;
            if (userOpt.isPresent()) {
                user = userOpt.get();
            } else {
                // Nếu chưa có user, tạo mới
                Role userRole = roleRepository.findByRoleName("Member")
                        .orElseGet(() -> roleRepository.save(new Role(null, "Member", "Thành viên đã đăng ký, có quyền truy cập khóa học và khảo sát")));


                user = new User();
                user.setEmail(email);
                user.setUsername(email);
                user.setFullName((String) payload.get("name"));
                user.setRole(userRole);
                user.setStatus(1);
                user.setPasswordHash("");

                userRepository.save(user);
            }

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }



}
