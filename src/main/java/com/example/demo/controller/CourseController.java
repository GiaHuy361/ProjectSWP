package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.CourseCategory;
import com.example.demo.entity.Course;
import com.example.demo.entity.User;
import com.example.demo.Mapper.CourseCategoryMapper;
import com.example.demo.Mapper.CourseMapper;
import com.example.demo.Mapper.CourseRegistrationMapper;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CourseCategoryService;
import com.example.demo.service.CourseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseCategoryService courseCategoryService;

    @Autowired
    private UserRepository userRepository;

    // Lấy danh sách khóa học dạng DTO
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        List<CourseDTO> courseDTOs = courses.stream()
                .map(CourseMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(courseDTOs);
    }

    // Lấy khóa học theo id dạng DTO
    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourse(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(course -> ResponseEntity.ok(CourseMapper.toDTO(course)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Tạo khóa học mới (Yêu cầu quyền Admin)
    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody @Valid CourseCreateDTO courseDTO) {
        try {
            Course course = courseService.createCourse(courseDTO);
            return ResponseEntity.ok(CourseMapper.toDTO(course));
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseDTO(e.getMessage(), HttpStatus.BAD_REQUEST.value()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<?> registerCourse(
            @PathVariable Long id,
            @RequestBody @Valid CourseRegistrationDTO registrationDTO,
            HttpServletRequest request) {
        logger.info("Register course attempt: courseId={}, registrationDTO={}", id, registrationDTO);
        logger.info("Session ID: {}", request.getSession().getId());
        try {
            if (registrationDTO.getCourseId() == null) {
                registrationDTO.setCourseId(id);
            } else if (!registrationDTO.getCourseId().equals(id)) {
                throw new IllegalArgumentException("Course ID in DTO does not match the path ID");
            }

            if (registrationDTO.getUserId() == null) {
                throw new IllegalArgumentException("User ID must not be null");
            }

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("User not authenticated for course registration: courseId={}", id);
                return new ResponseEntity<>(new ErrorResponseDTO("Not authenticated", HttpStatus.UNAUTHORIZED.value()), HttpStatus.UNAUTHORIZED);
            }
            String principal = authentication.getName();
            logger.info("Authenticated user principal: {}", principal);

            Optional<User> userOptional = userRepository.findByEmail(principal);
            if (!userOptional.isPresent()) {
                logger.info("User not found by email, trying username: {}", principal);
                userOptional = userRepository.findByUsername(principal);
            }
            if (!userOptional.isPresent()) {
                logger.error("User not found for principal: {}", principal);
                return new ResponseEntity<>(new ErrorResponseDTO("User not found", HttpStatus.NOT_FOUND.value()), HttpStatus.NOT_FOUND);
            }
            User user = userOptional.get();
            Long currentUserId = user.getId();
            logger.info("Authenticated user: userId={}", currentUserId);

            if (!registrationDTO.getUserId().equals(currentUserId)) {
                logger.warn("User {} attempted to register course for another user: {}", currentUserId, registrationDTO.getUserId());
                return new ResponseEntity<>(new ErrorResponseDTO("Bạn không có quyền đăng ký khóa học cho người dùng khác", HttpStatus.FORBIDDEN.value()), HttpStatus.FORBIDDEN);
            }

            CourseRegistrationDTO reg = courseService.registerCourse(registrationDTO.getUserId(), registrationDTO);
            logger.info("Course registered successfully: courseId={}, userId={}", id, registrationDTO.getUserId());
            return ResponseEntity.ok(reg);
        } catch (IllegalArgumentException e) {
            logger.error("Registration failed: {}", e.getMessage(), e);
            return new ResponseEntity<>(new ErrorResponseDTO(e.getMessage(), HttpStatus.BAD_REQUEST.value()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Internal server error during registration: {}", e.getMessage(), e);
            return new ResponseEntity<>(new ErrorResponseDTO("Internal server error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy danh sách đăng ký của user dạng DTO
    @GetMapping("/registrations")
    public ResponseEntity<?> getRegistrations(HttpServletRequest request) {
        logger.info("Fetching registrations for authenticated user");
        logger.info("Session ID: {}", request.getSession().getId());
        try {
            // Lấy userId từ thông tin xác thực
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("User not authenticated for fetching registrations");
                return new ResponseEntity<>(new ErrorResponseDTO("Not authenticated", HttpStatus.UNAUTHORIZED.value()), HttpStatus.UNAUTHORIZED);
            }
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        logger.error("User not found for email: {}", email);
                        return new IllegalArgumentException("User not found");
                    });
            Long currentUserId = user.getId();
            logger.info("Authenticated user: userId={}", currentUserId);

            List<CourseRegistrationDTO> registrations = courseService.getRegistrationsByUserId(currentUserId).stream()
                    .map(CourseRegistrationMapper::toDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(registrations);
        } catch (IllegalArgumentException e) {
            logger.error("Fetching registrations failed: {}", e.getMessage(), e);
            return new ResponseEntity<>(new ErrorResponseDTO(e.getMessage(), HttpStatus.BAD_REQUEST.value()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Internal server error while fetching registrations: {}", e.getMessage(), e);
            return new ResponseEntity<>(new ErrorResponseDTO("Internal server error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy khóa học theo category dạng DTO
    @GetMapping("/by-category")
    public ResponseEntity<List<CourseDTO>> getCoursesByCategory(@RequestParam Long categoryId) {
        List<Course> courses = courseService.getCoursesByCategory(categoryId);
        List<CourseDTO> courseDTOs = courses.stream()
                .map(CourseMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(courseDTOs);
    }

    // Lấy danh sách danh mục khóa học dạng DTO
    @GetMapping("/categories")
    public ResponseEntity<List<CourseCategoryDTO>> getAllCategories() {
        List<CourseCategory> categories = courseCategoryService.getAllCategories();
        List<CourseCategoryDTO> categoryDTOs = categories.stream()
                .map(CourseCategoryMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categoryDTOs);
    }
}