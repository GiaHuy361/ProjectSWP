package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")  // Đặt tên trường chính xác theo database
    private Integer roleId;

    @Column(name = "role_name", unique = true, length = 50, nullable = false)
    private String roleName;

    @Column(columnDefinition = "TEXT") // Mô tả có thể dài
    private String description;

    // Quan hệ nhiều-nhiều với User
    @ManyToMany(mappedBy = "roles")  // mappedBy trùng với tên biến roles trong User
    private Set<User> users;

    public Role() {}

    public Role(Integer roleId, String roleName, String description) {
        this.roleId = roleId;
        this.roleName = roleName;
        this.description = description;
    }

    // Getter và Setter

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }
}
