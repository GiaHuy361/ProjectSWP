package com.example.demo.Mapper;

import com.example.demo.dto.CourseCategoryCreateDTO;
import com.example.demo.dto.CourseCategoryDTO;
import com.example.demo.entity.CourseCategory;

public class CourseCategoryMapper {

    public static CourseCategoryDTO toDTO(CourseCategory category) {
        if (category == null) return null;

        return new CourseCategoryDTO(
                category.getCategoryId(),
                category.getName(),
                category.getDescription(),
                category.getParent() != null ? category.getParent().getCategoryId() : null
        );
    }

    public static CourseCategory fromCreateDTO(CourseCategoryCreateDTO dto) {
        if (dto == null) return null;

        CourseCategory category = new CourseCategory();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        if (dto.getParentId() != null) {
            CourseCategory parent = new CourseCategory();
            parent.setCategoryId(dto.getParentId());
            category.setParent(parent);
        }
        return category;
    }
}