package com.example.demo.controller;

import com.example.demo.entity.QuizAnswer;
import com.example.demo.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-answers")
public class QuizAnswerController {

    @Autowired
    private QuizService quizService;

    @GetMapping("/by-question")
    public List<QuizAnswer> getAnswersByQuestion(@RequestParam Long questionId) {
        return quizService.getAnswersByQuestion(questionId);
    }

    @PostMapping
    public ResponseEntity<QuizAnswer> createAnswer(@RequestBody QuizAnswer answer) {
        QuizAnswer saved = quizService.saveAnswer(answer);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{answerId}")
    public ResponseEntity<String> deleteAnswer(@PathVariable Long answerId) {
        quizService.deleteAnswer(answerId);
        return ResponseEntity.ok("Answer deleted");
    }
}
