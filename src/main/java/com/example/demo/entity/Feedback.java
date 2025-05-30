package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer feedbackId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String title;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status; // Enum với New, InProgress, Resolved

    private String priority;

    @Column(columnDefinition = "TEXT")
    private String response;

    private LocalDateTime resolvedAt;

    private LocalDateTime createdAt;

    // Constructors

    public Feedback() {
    }

    public Feedback(User user, String content, String title, Status status, String priority, String response, LocalDateTime resolvedAt, LocalDateTime createdAt) {
        this.user = user;
        this.content = content;
        this.title = title;
        this.status = status;
        this.priority = priority;
        this.response = response;
        this.resolvedAt = resolvedAt;
        this.createdAt = createdAt;
    }

    // Getters and Setters

    public Integer getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(Integer feedbackId) {
        this.feedbackId = feedbackId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Feedback{" +
                "feedbackId=" + feedbackId +
                ", user=" + (user != null ? user.getId() : null) +
                ", content='" + content + '\'' +
                ", title='" + title + '\'' +
                ", status=" + status +
                ", priority='" + priority + '\'' +
                ", response='" + response + '\'' +
                ", resolvedAt=" + resolvedAt +
                ", createdAt=" + createdAt +
                '}';
    }

    // Enum Status

    public enum Status {
        New,
        InProgress,
        Resolved
    }
}
