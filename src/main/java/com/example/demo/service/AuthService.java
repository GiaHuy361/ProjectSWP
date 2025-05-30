package com.example.demo.service;

import com.example.demo.entity.Permission;
import com.example.demo.entity.User;
import com.example.demo.repository.PermissionRepository;
import com.example.demo.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final GoogleTokenVerifierService googleTokenVerifierService;

    public AuthService(UserRepository userRepository, PermissionRepository permissionRepository, GoogleTokenVerifierService googleTokenVerifierService) {
        this.userRepository = userRepository;
        this.permissionRepository = permissionRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.googleTokenVerifierService = googleTokenVerifierService;
    }

    public boolean authenticate(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        return passwordEncoder.matches(rawPassword, user.getPasswordHash());
    }

    // Method dùng để cập nhật mật khẩu thành mã hóa BCrypt
    public void encodeAndSavePassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            System.out.println("User không tồn tại với email: " + email);
            return;
        }

        User user = userOpt.get();
        String rawPassword = user.getPasswordHash();
        String encodedPassword = passwordEncoder.encode(rawPassword);

        user.setPasswordHash(encodedPassword);
        userRepository.save(user);

        System.out.println("Mật khẩu đã được mã hóa và lưu thành công cho user: " + email);
    }

    // Method verify Google token
    public GoogleIdToken.Payload verifyGoogleToken(String idTokenString) throws Exception {
        return googleTokenVerifierService.verify(idTokenString);
    }

    // Method để lấy danh sách permissions của user
    public List<String> getUserPermissions(User user) {
        List<Integer> roleIds = user.getRoles().stream()
                .map(role -> role.getRoleId())
                .collect(Collectors.toList());
        return permissionRepository.findByRoleIds(roleIds).stream()
                .map(Permission::getPermissionName)
                .collect(Collectors.toList());
    }
}