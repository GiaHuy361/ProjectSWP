package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/school")
public class SchoolController {

    private final UserRepository userRepository;

    public SchoolController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Lấy danh sách học sinh/sinh viên trong trường
    @GetMapping("/students")
    public ResponseEntity<?> getStudents(@AuthenticationPrincipal User currentUser) {
        // TODO: lấy danh sách học sinh theo trường của giáo viên hiện tại
        return ResponseEntity.ok(List.of(
                Map.of("id", 201, "fullName", "Nguyễn Văn C", "class", "10A1"),
                Map.of("id", 202, "fullName", "Lê Thị D", "class", "10A2")
        ));
    }

    // Xem tiến độ học tập của học sinh theo id
    @GetMapping("/students/{id}/progress")
    public ResponseEntity<?> getStudentProgress(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        // TODO: kiểm tra quyền truy cập, lấy tiến độ học tập thực tế
        return ResponseEntity.ok(Map.of(
                "studentId", id,
                "progressPercent", 80,
                "coursesCompleted", 4,
                "coursesOngoing", 1
        ));
    }

    // Tạo hoặc cập nhật lịch học, lịch thi
    @PostMapping("/schedules")
    public ResponseEntity<?> createSchedule(@RequestBody Map<String, Object> scheduleData, @AuthenticationPrincipal User currentUser) {
        // TODO: xử lý tạo hoặc cập nhật lịch học, lịch thi
        return ResponseEntity.ok(Map.of("message", "Lịch học đã được cập nhật"));
    }

    // Xem báo cáo tổng hợp hoạt động học tập, khảo sát
    @GetMapping("/reports")
    public ResponseEntity<?> getReports(@AuthenticationPrincipal User currentUser) {
        // TODO: lấy báo cáo thực tế
        return ResponseEntity.ok(List.of(
                Map.of("reportId", 1, "title", "Báo cáo điểm trung bình", "date", "2025-05-25"),
                Map.of("reportId", 2, "title", "Báo cáo tiến độ học tập", "date", "2025-05-20")
        ));
    }

    // Gửi thông báo tới học sinh, phụ huynh
    @PostMapping("/notifications")
    public ResponseEntity<?> sendNotification(@RequestBody Map<String, String> notification, @AuthenticationPrincipal User currentUser) {
        // TODO: gửi thông báo đến người nhận
        return ResponseEntity.ok(Map.of("message", "Thông báo đã được gửi"));
    }
}
