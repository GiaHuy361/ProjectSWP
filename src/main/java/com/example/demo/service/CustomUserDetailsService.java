package com.example.demo.service;

import com.example.demo.entity.Permission;
import com.example.demo.entity.User;
import com.example.demo.repository.PermissionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;

    public CustomUserDetailsService(UserRepository userRepository, PermissionRepository permissionRepository) {
        this.userRepository = userRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail)));

        // Lấy danh sách roleId từ user
        List<Integer> roleIds = user.getRoles().stream()
                .map(role -> role.getRoleId())
                .collect(Collectors.toList());

        // Lấy danh sách permissions từ các role của user
        List<String> permissions = permissionRepository.findByRoleIds(roleIds).stream()
                .map(Permission::getPermissionName)
                .collect(Collectors.toList());

        // Tạo authorities từ roles và permissions
        List<GrantedAuthority> authorities = new ArrayList<>();

        // Thêm roles vào authorities (dùng tiền tố "ROLE_")
        authorities.addAll(user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getRoleName()))
                .collect(Collectors.toList()));

        // Thêm permissions vào authorities
        authorities.addAll(permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList()));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                authorities
        );
    }
}