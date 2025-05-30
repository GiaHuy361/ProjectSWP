package com.example.demo.dto;

import java.sql.Timestamp;

public class CourseReviewDTO {
    private Long reviewId;
    private Integer courseId;
    private Long userId;
    private Integer rating;
    private String comment;
    private Timestamp createdAt;

    // Getters và setters
    public Long getReviewId() { return reviewId; }
    public void setReviewId(Long reviewId) { this.reviewId = reviewId; }

    public Integer getCourseId() { return courseId; }
    public void setCourseId(Integer courseId) { this.courseId = courseId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}