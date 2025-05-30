
package com.example.demo.service;

import com.example.demo.dto.CourseCreateDTO;
import com.example.demo.dto.CourseRegistrationDTO;
import com.example.demo.entity.*;
import com.example.demo.Mapper.CourseMapper;
import com.example.demo.Mapper.CourseRegistrationMapper;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseRegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseCategoryRepository categoryRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);

    public java.util.Optional<Course> getCourseById(Long id) {
        if (id == null || id <= 0) {
            logger.warn("Invalid Course ID: {}", id);
            throw new IllegalArgumentException("Course ID must be a positive number");
        }
        logger.debug("Fetching course with ID: {}", id);
        return courseRepository.findById(id);
    }

    public List<CourseRegistration> getRegistrationsByUserId(Long userId) {
        return registrationRepository.findByUserId(userId);
    }

    public CourseRegistrationDTO registerCourse(Long userId, CourseRegistrationDTO registrationDTO) {
        if (registrationDTO.getCourseId() == null || registrationDTO.getUserId() == null) {
            throw new IllegalArgumentException("Course ID and User ID must not be null");
        }
        if (!registrationDTO.getUserId().equals(userId)) {
            throw new IllegalArgumentException("User ID in DTO does not match the provided userId");
        }
        if (registrationRepository.existsByUserIdAndCourseCourseId(userId, registrationDTO.getCourseId())) {
            throw new IllegalStateException("User already registered this course");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        Course course = courseRepository.findById(registrationDTO.getCourseId())
                .orElseThrow(() -> new NoSuchElementException("Course not found"));

        // Sử dụng CourseRegistrationMapper.fromDTO để ánh xạ
        registrationDTO.setRegistrationDate(new Timestamp(System.currentTimeMillis()));
        CourseRegistration registration = CourseRegistrationMapper.fromDTO(registrationDTO, user, course);
        return CourseRegistrationMapper.toDTO(registrationRepository.save(registration));
    }

    public List<Course> getCoursesByCategory(Long categoryId) {
        return courseRepository.findByCategoryId(categoryId);
    }

    public Course createCourse(CourseCreateDTO courseDTO) {
        Set<CourseCategory> categories = courseDTO.getCategoryIds().stream()
                .map(id -> categoryRepository.findById(id)
                        .orElseThrow(() -> new NoSuchElementException("Category not found: " + id)))
                .collect(Collectors.toSet());
        Course course = CourseMapper.fromCreateDTO(courseDTO, categories);
        return courseRepository.save(course);
    }
}
