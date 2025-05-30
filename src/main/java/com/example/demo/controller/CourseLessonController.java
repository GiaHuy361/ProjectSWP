package com.example.demo.controller;

import com.example.demo.entity.CourseLesson;
import com.example.demo.service.CourseLessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-lessons")
public class CourseLessonController {

    @Autowired
    private CourseLessonService lessonService;

    // Lấy danh sách bài học theo courseId
    @GetMapping
    public List<CourseLesson> getLessons(@RequestParam Integer courseId) {
        return lessonService.getLessonsByCourseId(courseId);
    }

    // Thêm bài học mới
    @PostMapping
    public ResponseEntity<?> addLesson(@RequestBody CourseLesson lesson) {
        try {
            CourseLesson saved = lessonService.addLesson(lesson);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi thêm bài học: " + e.getMessage());
        }
    }

    // Xóa bài học nếu cần
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        try {
            lessonService.deleteLesson(id);
            return ResponseEntity.ok("Xóa bài học thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa bài học: " + e.getMessage());
        }
    }
}
