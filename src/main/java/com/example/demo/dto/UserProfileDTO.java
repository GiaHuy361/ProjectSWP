package com.example.demo.dto;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.entity.UserProfile;
import com.example.demo.entity.Permission; // Import Permission
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class UserProfileDTO {
    private static final Logger logger = LoggerFactory.getLogger(UserProfileDTO.class);

    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String userType;
    private String dateOfBirth;
    private String address;
    private String schoolName;
    private List<String> roles;
    private List<String> permissions;

    public UserProfileDTO(User user, UserProfile profile) {
        // Kiểm tra null cho các trường từ User
        this.userId = user != null ? user.getId() : null;
        this.username = user != null && user.getUsername() != null ? user.getUsername() : "Chưa cập nhật";
        this.fullName = user != null && user.getFullName() != null ? user.getFullName() : "Chưa cập nhật";
        this.email = user != null && user.getEmail() != null ? user.getEmail() : "Chưa cập nhật";
        this.phone = user != null && user.getPhone() != null ? user.getPhone() : "Chưa cập nhật";
        this.roles = user != null && user.getRoles() != null
                ? user.getRoles().stream().map(Role::getRoleName).toList()
                : Collections.emptyList();
        this.permissions = user != null && user.getRoles() != null
                ? user.getRoles().stream()
                .flatMap(role -> role.getPermissions() != null ? role.getPermissions().stream() : Collections.<Permission>emptyList().stream())
                .map(Permission::getPermissionName)
                .distinct()
                .collect(Collectors.toList())
                : Collections.emptyList();

        // Ánh xạ từ UserProfile
        if (profile != null) {
            this.userType = profile.getUserType() != null ? profile.getUserType() : "Chưa cập nhật";
            this.dateOfBirth = formatDateOfBirth(profile.getDateOfBirth());
            this.address = profile.getAddress() != null ? profile.getAddress() : "Chưa cập nhật";
            this.schoolName = profile.getSchoolName() != null ? profile.getSchoolName() : "Chưa cập nhật";
        } else {
            this.userType = "Chưa cập nhật";
            this.dateOfBirth = "Chưa cập nhật";
            this.address = "Chưa cập nhật";
            this.schoolName = "Chưa cập nhật";
        }
    }

    // Phương thức định dạng dateOfBirth an toàn với đa luồng
    private String formatDateOfBirth(LocalDate dateOfBirth) {
        if (dateOfBirth == null) {
            return "Chưa cập nhật";
        }
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            return dateOfBirth.format(formatter);
        } catch (Exception e) {
            logger.error("Failed to format dateOfBirth: {}", dateOfBirth, e);
            return "Chưa cập nhật";
        }
    }

    // Getters và Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }
}