package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/parent")
public class ParentController {

    private final UserRepository userRepository;

    public ParentController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Lấy profile phụ huynh hiện tại
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Bạn chưa đăng nhập");
        }
        return ResponseEntity.ok(currentUser);
    }

    // Lấy danh sách học sinh/con thuộc phụ huynh (giả sử User có liên kết con trong DB)
    @GetMapping("/children")
    public ResponseEntity<?> getChildren(@AuthenticationPrincipal User currentUser) {
        // TODO: thực hiện lấy danh sách con của phụ huynh này
        // hiện giả sử trả về ví dụ giả
        return ResponseEntity.ok(List.of(
                Map.of("id", 101, "fullName", "Nguyễn Văn A", "progress", 75),
                Map.of("id", 102, "fullName", "Trần Thị B", "progress", 60)
        ));
    }

    // Xem tiến độ học tập của con theo ID con
    @GetMapping("/child/{childId}/progress")
    public ResponseEntity<?> getChildProgress(@PathVariable Long childId, @AuthenticationPrincipal User currentUser) {
        // TODO: kiểm tra childId thuộc phụ huynh này, sau đó lấy tiến độ học tập thực tế
        return ResponseEntity.ok(Map.of(
                "childId", childId,
                "progressPercent", 75,
                "coursesCompleted", 3,
                "coursesOngoing", 2
        ));
    }

    // Xem cảnh báo (ví dụ điểm kém, chưa hoàn thành bài tập)
    @GetMapping("/alerts")
    public ResponseEntity<?> getAlerts(@AuthenticationPrincipal User currentUser) {
        // TODO: lấy cảnh báo liên quan con/phụ huynh
        return ResponseEntity.ok(List.of(
                Map.of("type", "LowScore", "message", "Con bạn có điểm kém môn Toán"),
                Map.of("type", "Incomplete", "message", "Con bạn chưa hoàn thành bài tập Lịch sử")
        ));
    }

    // Xem lịch hẹn tư vấn
    @GetMapping("/appointments")
    public ResponseEntity<?> getAppointments(@AuthenticationPrincipal User currentUser) {
        // TODO: lấy lịch hẹn tư vấn
        return ResponseEntity.ok(List.of());
    }

    // Xem thông báo
    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(@AuthenticationPrincipal User currentUser) {
        // TODO: lấy thông báo cho phụ huynh
        return ResponseEntity.ok(List.of());
    }
}
