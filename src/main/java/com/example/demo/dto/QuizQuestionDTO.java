package com.example.demo.dto;

import java.sql.Timestamp;
import java.util.List;

public class QuizQuestionDTO {
    private Long questionId;
    private Long quizId;
    private String questionText;
    private String questionType; // Thêm trường này
    private Timestamp createdAt;
    private List<QuizAnswerDTO> answers;

    public QuizQuestionDTO() {}

    // getters và setters

    public Long getQuestionId() {
        return questionId;
    }
    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }
    public Long getQuizId() {
        return quizId;
    }
    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }
    public String getQuestionText() {
        return questionText;
    }
    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }
    public String getQuestionType() { return questionType; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    public List<QuizAnswerDTO> getAnswers() {
        return answers;
    }
    public void setAnswers(List<QuizAnswerDTO> answers) {
        this.answers = answers;
    }
}
