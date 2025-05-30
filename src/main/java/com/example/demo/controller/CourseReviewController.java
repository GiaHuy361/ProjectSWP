package com.example.demo.controller;

import com.example.demo.dto.CourseReviewDTO;
import com.example.demo.entity.CourseReview;
import com.example.demo.service.CourseReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/course-reviews")
public class CourseReviewController {

    @Autowired
    private CourseReviewService reviewService;

    @GetMapping
    public List<CourseReviewDTO> getReviews(@RequestParam Integer courseId) {
        List<CourseReview> reviews = reviewService.getReviewsByCourseId(courseId);
        return reviews.stream()
                .map(review -> new CourseReviewDTO(/* ánh xạ từ entity sang DTO */))
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody CourseReviewDTO reviewDTO) {
        try {
            CourseReview review = new CourseReview(/* ánh xạ từ DTO sang entity */);
            CourseReview saved = reviewService.addReview(review);
            return ResponseEntity.ok(new CourseReviewDTO(/* ánh xạ từ entity sang DTO */));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi thêm đánh giá: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok("Xóa đánh giá thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa đánh giá: " + e.getMessage());
        }
    }
}