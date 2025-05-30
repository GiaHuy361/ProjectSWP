package com.example.demo.dto;

public class CourseCategoryDTO {
    private Long categoryId;
    private String name;
    private String description;
    private Long parentId;

    public CourseCategoryDTO() {}
    public CourseCategoryDTO(Long categoryId, String name, String description, Long parentId) {
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
        this.parentId = parentId;
    }

    // Getters và setters
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
}