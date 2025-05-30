package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "permissions")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permission_id")
    private Long permissionId;

    @Column(name = "permission_name", nullable = false, unique = true, length = 100)
    private String permissionName;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Quan hệ nhiều-nhiều với Role qua bảng role_permissions
    @ManyToMany(mappedBy = "permissions")
    private Set<Role> roles = new HashSet<>();

    // Constructor mặc định
    public Permission() {
    }

    // Constructor với các tham số
    public Permission(Long permissionId, String permissionName, String description, Set<Role> roles) {
        this.permissionId = permissionId;
        this.permissionName = permissionName;
        this.description = description;
        this.roles = roles;
    }

    // Getter và Setter cho permissionId
    public Long getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(Long permissionId) {
        this.permissionId = permissionId;
    }

    // Getter và Setter cho permissionName
    public String getPermissionName() {
        return permissionName;
    }

    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName;
    }

    // Getter và Setter cho description
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // Getter và Setter cho roles
    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
}