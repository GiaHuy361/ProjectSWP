package com.example.demo.controller;

import com.example.demo.entity.Feedback;
import com.example.demo.entity.User;
import com.example.demo.repository.FeedbackRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/staff")
public class StaffController {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public StaffController(FeedbackRepository feedbackRepository, UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    // Lấy danh sách feedback mới (status = New hoặc InProgress)
    @GetMapping("/feedbacks")
    public ResponseEntity<List<Feedback>> getFeedbacks() {
        List<Feedback> feedbacks = feedbackRepository.findAll(); // Bạn có thể thêm filter theo status nếu muốn
        return ResponseEntity.ok(feedbacks);
    }

    // Xử lý phản hồi (cập nhật trạng thái, nội dung phản hồi)
    @PostMapping("/feedbacks/{id}/respond")
    public ResponseEntity<?> respondFeedback(
            @PathVariable Integer id,
            @RequestBody Map<String, String> responseData,
            @AuthenticationPrincipal UserDetails currentUser) {

        Optional<Feedback> optionalFeedback = feedbackRepository.findById(id);
        if (optionalFeedback.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Feedback feedback = optionalFeedback.get();

        // Cập nhật trạng thái phản hồi, ví dụ: "InProgress" hoặc "Resolved"
        if (responseData.containsKey("status")) {
            String statusStr = responseData.get("status");
            try {
                Feedback.Status status = Feedback.Status.valueOf(statusStr);
                feedback.setStatus(status);
                if (status == Feedback.Status.Resolved) {
                    feedback.setResolvedAt(LocalDateTime.now());
                }
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Trạng thái không hợp lệ");
            }
        }

        // Cập nhật nội dung phản hồi trả lời
        if (responseData.containsKey("response")) {
            feedback.setResponse(responseData.get("response"));
        }

        feedbackRepository.save(feedback);

        return ResponseEntity.ok(Map.of("message", "Phản hồi đã được xử lý"));
    }
}
