package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
public class StudentController {

    private final UserRepository userRepository;

    public StudentController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Ví dụ: Lấy thông tin profile học sinh hiện tại
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User currentUser) {
        // currentUser lấy từ Spring Security, chắc chắn là user đã login
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Bạn chưa đăng nhập");
        }
        return ResponseEntity.ok(currentUser);
    }

    // Ví dụ: Lấy danh sách khóa học đã đăng ký (cần viết service lấy data thực tế)
    @GetMapping("/courses")
    public ResponseEntity<?> getRegisteredCourses(@AuthenticationPrincipal User currentUser) {
        // TODO: gọi service để lấy danh sách khóa học đã đăng ký
        // Hiện giả sử trả về mảng trống
        return ResponseEntity.ok(List.of());
    }

    // Ví dụ: Xem lịch hẹn tư vấn
    @GetMapping("/appointments")
    public ResponseEntity<?> getAppointments(@AuthenticationPrincipal User currentUser) {
        // TODO: gọi service lấy lịch hẹn của học sinh
        return ResponseEntity.ok(List.of());
    }

    // Các API khác như làm khảo sát, xem thông báo có thể thêm tương tự
}
