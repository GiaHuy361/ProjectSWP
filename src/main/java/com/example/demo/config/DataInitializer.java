package com.example.demo.config;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

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
        Role guestRole = roleRepository.findByRoleName("Guest")
                .orElseGet(() -> roleRepository.save(new Role(null, "Guest", "Người dùng chưa đăng nhập hoặc truy cập giới hạn")));

        Role adminRole = roleRepository.findByRoleName("Admin")
                .orElseGet(() -> roleRepository.save(new Role(null, "Admin", "Quản trị viên toàn quyền, cấp phát quyền và cấu hình hệ thống")));

        Role memberRole = roleRepository.findByRoleName("Member")
                .orElseGet(() -> roleRepository.save(new Role(null, "Member", "Thành viên đã đăng ký, có quyền truy cập khóa học và khảo sát")));

        Role staffRole = roleRepository.findByRoleName("Staff")
                .orElseGet(() -> roleRepository.save(new Role(null, "Staff", "Nhân viên hỗ trợ, xử lý phản hồi và tư vấn cơ bản")));

        Role consultantRole = roleRepository.findByRoleName("Consultant")
                .orElseGet(() -> roleRepository.save(new Role(null, "Consultant", "Chuyên viên tư vấn trực tiếp cho người dùng")));

        Role managerRole = roleRepository.findByRoleName("Manager")
                .orElseGet(() -> roleRepository.save(new Role(null, "Manager", "Quản lý hệ thống, giám sát hoạt động và báo cáo")));

        // Tạo user guest với role Guest
        if (userRepository.findByEmail("john@example.com").isEmpty()) {
            User user = new User();
            user.setUsername("john_doe");
            user.setEmail("john@example.com");
            user.setFullName("John Doe");
            user.setPhone("0123456789");
            user.setStatus(1);
            user.setPasswordHash(passwordEncoder.encode("123456"));

            Set<Role> roles = new HashSet<>();
            roles.add(guestRole);
            user.setRoles(roles);

            userRepository.save(user);
        }

        // Tạo user admin với role Admin
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setFullName("Admin User");
            admin.setPhone("0987654321");
            admin.setStatus(1);
            admin.setPasswordHash(passwordEncoder.encode("123456"));

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
        }

        System.out.println("Sample users and roles created.");
    }
}
