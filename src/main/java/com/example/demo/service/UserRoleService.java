package com.example.demo.service;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class UserRoleService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserRoleService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public Set<Role> getUserRoles(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        return user.getRoles();
    }

    public void addRoleToUser(Long userId, Integer roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

        Set<Role> roles = user.getRoles();
        if (roles == null) {
            roles = new HashSet<>();
        }

        if (!roles.contains(role)) {
            roles.add(role);
            user.setRoles(roles);
            userRepository.save(user);
        }
    }

    public void removeRoleFromUser(Long userId, Integer roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

        Set<Role> roles = user.getRoles();
        if (roles != null && roles.contains(role)) {
            roles.remove(role);
            user.setRoles(roles);
            userRepository.save(user);
        }
    }
}
