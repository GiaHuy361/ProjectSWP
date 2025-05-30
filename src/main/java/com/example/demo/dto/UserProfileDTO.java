package com.example.demo.dto;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.entity.UserProfile;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;

public class UserProfileDTO {
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

    public UserProfileDTO(User user, UserProfile profile) {
        // Kiểm tra null cho các trường từ User
        this.userId = user != null ? user.getId() : null;
        this.username = user != null && user.getUsername() != null ? user.getUsername() : null;
        this.fullName = user != null && user.getFullName() != null ? user.getFullName() : null;
        this.email = user != null && user.getEmail() != null ? user.getEmail() : null;
        this.phone = user != null && user.getPhone() != null ? user.getPhone() : null;
        this.roles = user != null && user.getRoles() != null
                ? user.getRoles().stream().map(Role::getRoleName).toList()
                : Collections.emptyList();

        // profile không bao giờ là null (do logic trong AuthController)
        if (profile != null) {
            this.userType = profile.getUserType(); // Không cần gán "Unknown", vì userType luôn được gán trong AuthController
            this.dateOfBirth = formatDateOfBirth(profile.getDateOfBirth());
            this.address = profile.getAddress();
            this.schoolName = profile.getSchoolName();
        }
    }

    // Phương thức định dạng dateOfBirth an toàn với đa luồng
    private String formatDateOfBirth(java.util.Date dateOfBirth) {
        if (dateOfBirth == null) {
            return null;
        }
        try {
            LocalDate localDate = dateOfBirth.toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            return localDate.format(formatter);
        } catch (Exception e) {
            // Log lỗi nếu cần
            return null;
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
}