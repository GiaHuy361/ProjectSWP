package com.example.demo.repository;

import com.example.demo.entity.CourseRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, Long> {
    List<CourseRegistration> findByUserId(Long userId);
    boolean existsByUserIdAndCourseCourseId(Long userId, Long courseId);
}