package com.example.demo.dto;

public class CourseCategoryCreateDTO {
    private String name;
    private String description;
    private Long parentId;

    // Getters và setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
}