package com.example.demo.dto;

import java.sql.Timestamp;

public class QuizResultDTO {
    private Long resultId;
    private Long quizId;
    private Long userId;
    private Integer score;
    private Boolean passed;
    private Timestamp takenAt;

    public QuizResultDTO() {}

    // getters và setters

    public Long getResultId() {
        return resultId;
    }
    public void setResultId(Long resultId) {
        this.resultId = resultId;
    }
    public Long getQuizId() {
        return quizId;
    }
    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Integer getScore() {
        return score;
    }
    public void setScore(Integer score) {
        this.score = score;
    }
    public Boolean getPassed() {
        return passed;
    }
    public void setPassed(Boolean passed) {
        this.passed = passed;
    }
    public Timestamp getTakenAt() {
        return takenAt;
    }
    public void setTakenAt(Timestamp takenAt) {
        this.takenAt = takenAt;
    }
}
