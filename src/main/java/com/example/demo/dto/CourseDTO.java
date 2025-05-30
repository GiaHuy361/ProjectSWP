package com.example.demo.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Set;

public class CourseDTO {
    private Long courseId;
    private String title;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Float ratingAvg;
    private Integer ratingCount;
    private String ageRange;
    private String duration;
    private Timestamp createdAt; // Thêm
    private Timestamp updatedAt; // Thêm
    private Set<CategoryInfo> categories;

    public static class CategoryInfo {
        private Long categoryId; // Đổi từ Integer sang Long
        private String name;

        public CategoryInfo(Long categoryId, String name) {
            this.categoryId = categoryId;
            this.name = name;
        }

        // Getters và setters
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    // Getters và setters
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Float getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(Float ratingAvg) { this.ratingAvg = ratingAvg; }
    public Integer getRatingCount() { return ratingCount; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }
    public String getAgeRange() { return ageRange; }
    public void setAgeRange(String ageRange) { this.ageRange = ageRange; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
    public Set<CategoryInfo> getCategories() { return categories; }
    public void setCategories(Set<CategoryInfo> categories) { this.categories = categories; }
}