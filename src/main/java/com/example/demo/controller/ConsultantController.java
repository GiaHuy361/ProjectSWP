package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/consultant")
public class ConsultantController {

    private final UserRepository userRepository;

    public ConsultantController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Xem lịch hẹn tư vấn được giao
    @GetMapping("/appointments")
    public ResponseEntity<?> getAppointments(@AuthenticationPrincipal User currentUser) {
        // TODO: lấy lịch hẹn được phân công cho chuyên viên
        return ResponseEntity.ok(List.of(
                Map.of("appointmentId", 301, "user", "Nguyễn Văn X", "date", "2025-05-26 10:00"),
                Map.of("appointmentId", 302, "user", "Trần Thị Y", "date", "2025-05-27 14:00")
        ));
    }

    // Cập nhật kết quả tư vấn
    @PostMapping("/appointments/{id}/update")
    public ResponseEntity<?> updateConsultation(@PathVariable Long id, @RequestBody Map<String, String> consultationData, @AuthenticationPrincipal User currentUser) {
        // TODO: lưu kết quả tư vấn, ghi chú, đánh giá
        return ResponseEntity.ok(Map.of("message", "Kết quả tư vấn đã được cập nhật"));
    }

    // Xem thông tin profile chuyên viên tư vấn
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Bạn chưa đăng nhập");
        }
        return ResponseEntity.ok(currentUser);
    }

    // Cập nhật thông tin profile chuyên viên tư vấn
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> profileData, @AuthenticationPrincipal User currentUser) {
        // TODO: cập nhật thông tin chuyên viên
        return ResponseEntity.ok(Map.of("message", "Thông tin profile đã được cập nhật"));
    }
}
