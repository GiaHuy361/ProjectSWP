
        package com.example.demo.Mapper;

import com.example.demo.dto.CourseRegistrationDTO;
import com.example.demo.entity.Course;
import com.example.demo.entity.CourseRegistration;
import com.example.demo.entity.RegistrationStatus;
import com.example.demo.entity.User;
import java.util.Arrays;

public class CourseRegistrationMapper {

    public static CourseRegistrationDTO toDTO(CourseRegistration registration) {
        if (registration == null) return null;

        CourseRegistrationDTO dto = new CourseRegistrationDTO();
        dto.setRegistrationId(registration.getRegistrationId());
        dto.setUserId(registration.getUser() != null ? registration.getUser().getId() : null);
        dto.setCourseId(registration.getCourse() != null ? registration.getCourse().getCourseId() : null);
        dto.setRegistrationDate(registration.getRegistrationDate());
        dto.setStatus(registration.getStatus() != null ? registration.getStatus().name() : null);

        return dto;
    }

    public static CourseRegistration fromDTO(CourseRegistrationDTO dto, User user, Course course) {
        if (dto == null) return null;

        // Kiểm tra user và course không null vì database yêu cầu NOT NULL
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null for CourseRegistration");
        }
        if (course == null) {
            throw new IllegalArgumentException("Course cannot be null for CourseRegistration");
        }

        CourseRegistration registration = new CourseRegistration();
        registration.setRegistrationId(dto.getRegistrationId());
        registration.setUser(user);
        registration.setCourse(course);
        registration.setRegistrationDate(dto.getRegistrationDate());

        // Xử lý status một cách an toàn
        if (dto.getStatus() != null && !dto.getStatus().isEmpty()) {
            try {
                // Chuẩn hóa status: viết hoa chữ cái đầu, còn lại viết thường
                String statusStr = dto.getStatus().substring(0, 1).toUpperCase() +
                        dto.getStatus().substring(1).toLowerCase();
                // Kiểm tra xem status có hợp lệ không
                RegistrationStatus status = RegistrationStatus.valueOf(statusStr);
                registration.setStatus(status);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException(
                        "Invalid status value: " + dto.getStatus() +
                                ". Must be one of: " + Arrays.toString(RegistrationStatus.values())
                );
            }
        } else {
            // Nếu status null hoặc rỗng, gán giá trị mặc định
            registration.setStatus(RegistrationStatus.Pending);
        }

        return registration;
    }
}