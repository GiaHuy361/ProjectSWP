package com.example.demo.controller;

import com.example.demo.entity.Report;
import com.example.demo.entity.User;
import com.example.demo.repository.ReportRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manager")
public class ManagerController {

    private final UserRepository userRepository;
    private final ReportRepository reportRepository;

    public ManagerController(UserRepository userRepository, ReportRepository reportRepository) {
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
    }

    // API lấy danh sách tất cả user (manager có thể quản lý user)
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // API lấy báo cáo
    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getReports() {
        List<Report> reports = reportRepository.findAll();
        return ResponseEntity.ok(reports);
    }

    // API tạo báo cáo mới (ví dụ)
    @PostMapping("/reports")
    public ResponseEntity<Report> createReport(@RequestBody Report report) {
        Report savedReport = reportRepository.save(report);
        return ResponseEntity.ok(savedReport);
    }

    // API xem thông tin cá nhân manager
    @GetMapping("/profile")
    public ResponseEntity<User> getManagerProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        return ResponseEntity.ok(user);
    }

    // Bạn có thể thêm các API khác theo chức năng quản lý hệ thống
}
