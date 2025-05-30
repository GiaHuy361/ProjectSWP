package com.example.demo.dto;

public class QuizAnswerDTO {
    private Long answerId;
    private Long questionId;
    private String answerText;
    private Boolean isCorrect;

    public QuizAnswerDTO() {}

    // getters và setters

    public Long getAnswerId() {
        return answerId;
    }
    public void setAnswerId(Long answerId) {
        this.answerId = answerId;
    }
    public Long getQuestionId() {
        return questionId;
    }
    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }
    public String getAnswerText() {
        return answerText;
    }
    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }
    public Boolean getIsCorrect() {
        return isCorrect;
    }
    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
}
