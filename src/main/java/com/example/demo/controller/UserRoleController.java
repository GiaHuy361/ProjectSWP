package com.example.demo.controller;

import com.example.demo.entity.Role;
import com.example.demo.service.UserRoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/admin/users")
public class UserRoleController {

    private final UserRoleService userRoleService;

    public UserRoleController(UserRoleService userRoleService) {
        this.userRoleService = userRoleService;
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping("/{userId}/roles")
    public ResponseEntity<Set<Role>> getUserRoles(@PathVariable Long userId) {
        Set<Role> roles = userRoleService.getUserRoles(userId);
        return ResponseEntity.ok(roles);
    }

    @PreAuthorize("hasRole('Admin')")
    @PostMapping("/{userId}/roles/{roleId}")
    public ResponseEntity<String> addRoleToUser(@PathVariable Long userId, @PathVariable Integer roleId) {
        userRoleService.addRoleToUser(userId, roleId);
        return ResponseEntity.ok("Đã gán role cho user thành công");
    }

    @PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{userId}/roles/{roleId}")
    public ResponseEntity<String> removeRoleFromUser(@PathVariable Long userId, @PathVariable Integer roleId) {
        userRoleService.removeRoleFromUser(userId, roleId);
        return ResponseEntity.ok("Đã thu hồi role khỏi user thành công");
    }
}
