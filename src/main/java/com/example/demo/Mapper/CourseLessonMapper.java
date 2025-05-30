package com.example.demo.Mapper;

import com.example.demo.dto.CourseLessonDTO;
import com.example.demo.entity.Course;
import com.example.demo.entity.CourseLesson;

public class CourseLessonMapper {

    public static CourseLessonDTO toDTO(CourseLesson lesson) {
        if (lesson == null) return null;

        CourseLessonDTO dto = new CourseLessonDTO();
        dto.setLessonId(lesson.getLessonId());
        dto.setCourseId(lesson.getCourse() != null ? lesson.getCourse().getCourseId() : null);
        dto.setTitle(lesson.getTitle());
        dto.setContent(lesson.getContent());
        dto.setVideoUrl(lesson.getVideoUrl());
        dto.setLessonOrder(lesson.getLessonOrder());
        dto.setCreatedAt(lesson.getCreatedAt());
        dto.setUpdatedAt(lesson.getUpdatedAt());

        return dto;
    }

    public static CourseLesson fromDTO(CourseLessonDTO dto, Course course) {
        if (dto == null) return null;

        CourseLesson lesson = new CourseLesson();
        lesson.setLessonId(dto.getLessonId());
        lesson.setCourse(course);
        lesson.setTitle(dto.getTitle());
        lesson.setContent(dto.getContent());
        lesson.setVideoUrl(dto.getVideoUrl());
        lesson.setLessonOrder(dto.getLessonOrder());
        // Không set createdAt và updatedAt vì JPA tự xử lý

        return lesson;
    }
}