package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "role_permissions")
public class RolePermission {
    @EmbeddedId
    private RolePermissionId id;

    @ManyToOne
    @MapsId("roleId")
    @JoinColumn(name = "role_id")
    private Role role;

    @ManyToOne
    @MapsId("permissionId")
    @JoinColumn(name = "permission_id")
    private Permission permission;

    // Constructor mặc định
    public RolePermission() {
    }

    // Constructor với các tham số
    public RolePermission(RolePermissionId id, Role role, Permission permission) {
        this.id = id;
        this.role = role;
        this.permission = permission;
    }

    // Getter và Setter cho id
    public RolePermissionId getId() {
        return id;
    }

    public void setId(RolePermissionId id) {
        this.id = id;
    }

    // Getter và Setter cho role
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    // Getter và Setter cho permission
    public Permission getPermission() {
        return permission;
    }

    public void setPermission(Permission permission) {
        this.permission = permission;
    }

    // Lớp RolePermissionId để nhúng
    @Embeddable
    public static class RolePermissionId {
        private Integer roleId;
        private Long permissionId;

        // Constructor mặc định
        public RolePermissionId() {
        }

        // Constructor với các tham số
        public RolePermissionId(Integer roleId, Long permissionId) {
            this.roleId = roleId;
            this.permissionId = permissionId;
        }

        // Getter và Setter cho roleId
        public Integer getRoleId() {
            return roleId;
        }

        public void setRoleId(Integer roleId) {
            this.roleId = roleId;
        }

        // Getter và Setter cho permissionId
        public Long getPermissionId() {
            return permissionId;
        }

        public void setPermissionId(Long permissionId) {
            this.permissionId = permissionId;
        }
    }
}