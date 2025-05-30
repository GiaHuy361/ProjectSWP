package com.example.demo.controller;

import com.example.demo.entity.QuizResult;
import com.example.demo.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-results")
public class QuizResultController {

    @Autowired
    private QuizService quizService;

    @GetMapping("/by-user")
    public List<QuizResult> getResultsByUser(@RequestParam Long userId) {
        return quizService.getResultsByUser(userId);
    }

    @GetMapping("/by-quiz")
    public List<QuizResult> getResultsByQuiz(@RequestParam Long quizId) {
        return quizService.getResultsByQuiz(quizId);
    }

    @PostMapping
    public ResponseEntity<QuizResult> createResult(@RequestBody QuizResult result) {
        QuizResult saved = quizService.saveResult(result);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{resultId}")
    public ResponseEntity<String> deleteResult(@PathVariable Long resultId) {
        quizService.deleteResult(resultId);
        return ResponseEntity.ok("Result deleted");
    }
}
