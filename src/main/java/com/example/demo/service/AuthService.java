package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
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
        String rawPassword = user.getPasswordHash(); // giả sử mật khẩu hiện tại đang là plain text trong field passwordHash
        String encodedPassword = passwordEncoder.encode(rawPassword);

        user.setPasswordHash(encodedPassword);
        userRepository.save(user);

        System.out.println("Mật khẩu đã được mã hóa và lưu thành công cho user: " + email);
    }
}

