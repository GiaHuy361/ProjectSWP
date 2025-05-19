package com.example.demo.config;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public void run(String... args) throws Exception {
        Role userRole = roleRepository.findByName("USER")
                .orElseGet(() -> roleRepository.save(new Role(null, "USER")));

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> roleRepository.save(new Role(null, "ADMIN")));

        if (userRepository.findByEmail("john@example.com").isEmpty()) {
            User user = new User();
            user.setUsername("john_doe");
            user.setEmail("john@example.com");
            user.setFullName("John Doe");
            user.setPhone("0123456789");
            user.setRole(userRole);
            user.setStatus(1);
            user.setPasswordHash(passwordEncoder.encode("123456"));
            userRepository.save(user);
        }

        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setFullName("Admin User");
            admin.setPhone("0987654321");
            admin.setRole(adminRole);
            admin.setStatus(1);
            admin.setPasswordHash(passwordEncoder.encode("123456"));
            userRepository.save(admin);
        }

        System.out.println("Sample users and roles created.");
    }
}
