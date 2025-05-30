package com.example.demo.repository;

import com.example.demo.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.Set;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRoleName(String roleName);
    Set<Role> findByRoleNameIn(Set<String> roleNames);
}

