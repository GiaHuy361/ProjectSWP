package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizQuestionRepository questionRepository;

    @Autowired
    private QuizAnswerRepository answerRepository;

    @Autowired
    private QuizResultRepository resultRepository;

    // --- Quiz ---
    public List<Quiz> getQuizzesByCourse(Long courseId) {
        return quizRepository.findByCourseCourseId(courseId);
    }

    public Quiz saveQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public void deleteQuiz(Long quizId) {
        quizRepository.deleteById(quizId);
    }

    // --- QuizQuestion ---
    public List<QuizQuestion> getQuestionsByQuiz(Long quizId) {
        return questionRepository.findByQuizQuizId(quizId);
    }

    public QuizQuestion saveQuestion(QuizQuestion question) {
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long questionId) {
        questionRepository.deleteById(questionId);
    }

    // --- QuizAnswer ---
    public List<QuizAnswer> getAnswersByQuestion(Long questionId) {
        return answerRepository.findByQuestionQuestionId(questionId);
    }

    public QuizAnswer saveAnswer(QuizAnswer answer) {
        return answerRepository.save(answer);
    }

    public void deleteAnswer(Long answerId) {
        answerRepository.deleteById(answerId);
    }

    // --- QuizResult ---
    public List<QuizResult> getResultsByUser(Long userId) {
        return resultRepository.findByUser_Id(userId);
    }

    public List<QuizResult> getResultsByQuiz(Long quizId) {
        return resultRepository.findByQuiz_QuizId(quizId);
    }

    public QuizResult saveResult(QuizResult result) {
        return resultRepository.save(result);
    }

    public void deleteResult(Long resultId) {
        resultRepository.deleteById(resultId);
    }
}
