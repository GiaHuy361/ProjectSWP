package com.example.demo.repository;

import com.example.demo.entity.CourseLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseLessonRepository extends JpaRepository<CourseLesson, Long> {
    List<CourseLesson> findByCourseCourseIdOrderByLessonOrderAsc(Integer courseId);
}
