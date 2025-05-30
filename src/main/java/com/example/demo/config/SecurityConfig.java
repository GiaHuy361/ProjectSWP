package com.example.demo.config;

import com.example.demo.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                        .sessionFixation().migrateSession()
                        .maximumSessions(1)
                )
                .securityContext(security -> security.requireExplicitSave(false)) // Lưu SecurityContext tự động
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/guest/**").permitAll()
                        .requestMatchers("/api/courses").permitAll()
                        .requestMatchers("/api/courses/{id}").permitAll()
                        .requestMatchers("/api/courses/by-category").permitAll()
                        .requestMatchers("/api/courses/categories").permitAll()
                        .requestMatchers("/api/courses/{id}/register").hasAnyRole("Student", "Member", "Parent")
                        .requestMatchers("/api/courses/registrations").hasAnyRole("Student", "Member", "Parent")
                        .requestMatchers("/api/lessons/**").hasAnyRole("Teacher", "Manager", "Admin", "Student", "Member")
                        .requestMatchers("/api/reviews/**").hasAnyRole("Student", "Member", "Teacher")
                        .requestMatchers("/api/feedback/**").hasAnyRole("Student", "Parent", "Member", "Consultant")
                        .requestMatchers("/api/quiz/**").hasAnyRole("Student", "Teacher", "Admin", "Member")
                        .requestMatchers("/api/quiz-question/**").hasAnyRole("Teacher", "Admin", "Student", "Member")
                        .requestMatchers("/api/quiz-answer/**").hasAnyRole("Teacher", "Admin", "Student", "Member")
                        .requestMatchers("/api/quiz-result/**").hasAnyRole("Student", "Teacher", "Admin", "Member")
                        .requestMatchers("/parent/**").hasRole("Parent")
                        .requestMatchers("/student/**").hasRole("Student")
                        .requestMatchers("/school/**", "/teacher/**").hasRole("Teacher")
                        .requestMatchers("/member/**").hasAnyRole("Member", "Staff", "Consultant", "Manager", "Admin")
                        .requestMatchers("/staff/**").hasAnyRole("Staff", "Consultant", "Manager", "Admin")
                        .requestMatchers("/consultant/**").hasAnyRole("Consultant", "Manager", "Admin")
                        .requestMatchers("/manager/**").hasAnyRole("Manager", "Admin")
                        .requestMatchers("/admin/**").hasRole("Admin")
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}