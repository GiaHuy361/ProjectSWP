package com.example.demo.controller;

import com.example.demo.entity.QuizQuestion;
import com.example.demo.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-questions")
public class QuizQuestionController {

    @Autowired
    private QuizService quizService;

    @GetMapping("/by-quiz")
    public List<QuizQuestion> getQuestionsByQuiz(@RequestParam Long quizId) {
        return quizService.getQuestionsByQuiz(quizId);
    }

    @PostMapping
    public ResponseEntity<QuizQuestion> createQuestion(@RequestBody QuizQuestion question) {
        QuizQuestion saved = quizService.saveQuestion(question);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long questionId) {
        quizService.deleteQuestion(questionId);
        return ResponseEntity.ok("Question deleted");
    }
}
