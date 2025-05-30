
package com.example.demo.Mapper;

import com.example.demo.dto.CourseCreateDTO;
import com.example.demo.dto.CourseDTO;
import com.example.demo.entity.Course;
import com.example.demo.entity.CourseCategory;

import java.sql.Timestamp;
import java.util.Set;
import java.util.stream.Collectors;

public class CourseMapper {

    public static CourseDTO toDTO(Course course) {
        if (course == null) return null;

        CourseDTO dto = new CourseDTO();
        dto.setCourseId(course.getCourseId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setPrice(course.getPrice());
        dto.setImageUrl(course.getImageUrl());
        dto.setRatingAvg(course.getRatingAvg());
        dto.setRatingCount(course.getRatingCount());
        dto.setAgeRange(course.getAgeRange());
        dto.setDuration(course.getDuration());
        // Kiểm tra null cho createdAt và updatedAt
        dto.setCreatedAt(course.getCreatedAt() != null ? course.getCreatedAt() : new Timestamp(System.currentTimeMillis()));
        dto.setUpdatedAt(course.getUpdatedAt() != null ? course.getUpdatedAt() : new Timestamp(System.currentTimeMillis()));

        if (course.getCategories() != null) {
            Set<CourseDTO.CategoryInfo> categories = course.getCategories().stream()
                    .map(c -> new CourseDTO.CategoryInfo(c.getCategoryId(), c.getName()))
                    .collect(Collectors.toSet());
            dto.setCategories(categories);
        }
        return dto;
    }

    public static Course fromCreateDTO(CourseCreateDTO dto, Set<CourseCategory> categories) {
        if (dto == null) return null;

        Course course = new Course();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setPrice(dto.getPrice());
        course.setImageUrl(dto.getImageUrl());
        course.setAgeRange(dto.getAgeRange());
        course.setDuration(dto.getDuration());
        course.setCategories(categories);
        return course;
    }
}
