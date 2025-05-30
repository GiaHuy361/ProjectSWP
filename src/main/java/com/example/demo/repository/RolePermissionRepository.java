package com.example.demo.repository;

import com.example.demo.entity.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolePermissionRepository extends JpaRepository<RolePermission, RolePermission.RolePermissionId> {
}