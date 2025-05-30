package com.example.demo.controller;

import com.example.demo.entity.Feedback;
import com.example.demo.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // Lấy danh sách feedback mới và đang xử lý
    @GetMapping("/list")
    public ResponseEntity<List<Feedback>> getFeedbacks() {
        List<Feedback> feedbacks = feedbackService.getNewAndInProgressFeedbacks();
        return ResponseEntity.ok(feedbacks);
    }

    // Cập nhật phản hồi cho feedback theo id
    @PostMapping("/{id}/respond")
    public ResponseEntity<String> respondFeedback(@PathVariable Integer id,
                                                  @RequestBody Map<String, String> responseData) {
        boolean success = feedbackService.respondFeedback(id, responseData);
        if (success) {
            return ResponseEntity.ok("Phản hồi đã được xử lý");
        } else {
            return ResponseEntity.badRequest().body("Không tìm thấy feedback hoặc dữ liệu không hợp lệ");
        }
    }
}
