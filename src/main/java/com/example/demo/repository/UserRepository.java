package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    // --- Bước 3: Thêm các phương thức cho Google Login ---
    Optional<User> findByGoogleId(String googleId);

    // Tìm user theo email hoặc googleId (nếu cần)
    Optional<User> findByEmailOrGoogleId(String email, String googleId);
}
