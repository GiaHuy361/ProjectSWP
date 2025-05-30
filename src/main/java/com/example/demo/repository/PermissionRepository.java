package com.example.demo.repository;

import com.example.demo.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    @Query("SELECT p FROM Permission p JOIN RolePermission rp ON p.permissionId = rp.permission.permissionId WHERE rp.role.roleId IN :roleIds")
    List<Permission> findByRoleIds(@Param("roleIds") List<Integer> roleIds);
}