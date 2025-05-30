package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    // --- Quiz ---
    @GetMapping("/by-course")
    public List<Quiz> getQuizzesByCourse(@RequestParam Long courseId) {
        return quizService.getQuizzesByCourse(courseId);
    }

    @PostMapping
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {
        Quiz saved = quizService.saveQuiz(quiz);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Long quizId) {
        quizService.deleteQuiz(quizId);
        return ResponseEntity.ok("Quiz deleted");
    }

    // --- QuizQuestion ---
    @GetMapping("/{quizId}/questions")
    public List<QuizQuestion> getQuestions(@PathVariable Long quizId) {
        return quizService.getQuestionsByQuiz(quizId);
    }

    @PostMapping("/{quizId}/questions")
    public ResponseEntity<QuizQuestion> addQuestion(@PathVariable Long quizId, @RequestBody QuizQuestion question) {
        question.setQuiz(new Quiz());
        question.getQuiz().setQuizId(quizId);
        QuizQuestion saved = quizService.saveQuestion(question);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long questionId) {
        quizService.deleteQuestion(questionId);
        return ResponseEntity.ok("Question deleted");
    }

    // --- QuizAnswer ---
    @GetMapping("/questions/{questionId}/answers")
    public List<QuizAnswer> getAnswers(@PathVariable Long questionId) {
        return quizService.getAnswersByQuestion(questionId);
    }

    @PostMapping("/questions/{questionId}/answers")
    public ResponseEntity<QuizAnswer> addAnswer(@PathVariable Long questionId, @RequestBody QuizAnswer answer) {
        answer.setQuestion(new QuizQuestion());
        answer.getQuestion().setQuestionId(questionId);
        QuizAnswer saved = quizService.saveAnswer(answer);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/answers/{answerId}")
    public ResponseEntity<String> deleteAnswer(@PathVariable Long answerId) {
        quizService.deleteAnswer(answerId);
        return ResponseEntity.ok("Answer deleted");
    }

    // --- QuizResult ---
    @GetMapping("/results/user/{userId}")
    public List<QuizResult> getResultsByUser(@PathVariable Long userId) {
        return quizService.getResultsByUser(userId);
    }

    @GetMapping("/results/quiz/{quizId}")
    public List<QuizResult> getResultsByQuiz(@PathVariable Long quizId) {
        return quizService.getResultsByQuiz(quizId);
    }

    @PostMapping("/results")
    public ResponseEntity<QuizResult> addResult(@RequestBody QuizResult result) {
        QuizResult saved = quizService.saveResult(result);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/results/{resultId}")
    public ResponseEntity<String> deleteResult(@PathVariable Long resultId) {
        quizService.deleteResult(resultId);
        return ResponseEntity.ok("Result deleted");
    }
}
