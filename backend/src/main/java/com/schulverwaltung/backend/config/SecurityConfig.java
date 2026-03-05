package com.schulverwaltung.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // Teachers (GET public for list/detail; POST/PUT/DELETE only ADMIN)
                        .requestMatchers(HttpMethod.GET, "/api/teachers").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/teachers/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/teachers").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/teachers/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/teachers/**").hasRole("ADMIN")

                        // Students: list public; create/update/delete only ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/students").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/students").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/students/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/students/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/students/**").hasRole("ADMIN")

                        // Exams, Assignments, Results: GET public; create/update/delete for ADMIN and TEACHER
                        .requestMatchers(HttpMethod.GET, "/api/exams", "/api/exams/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/exams").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.PUT, "/api/exams/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/exams/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.GET, "/api/assignments", "/api/assignments/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/assignments").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.PUT, "/api/assignments/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/assignments/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.GET, "/api/results", "/api/results/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/results").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.PUT, "/api/results/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/results/**").hasAnyRole("ADMIN", "TEACHER")
                        // Lessons: GET public; create/delete only ADMIN; update ADMIN or TEACHER
                        .requestMatchers(HttpMethod.GET, "/api/lessons", "/api/lessons/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/lessons").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/lessons/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/lessons/**").hasRole("ADMIN")
                        // Events, Announcements, Attendance: GET public; create/update/delete for ADMIN and TEACHER
                        .requestMatchers(HttpMethod.GET, "/api/events", "/api/events/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/events").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.PUT, "/api/events/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.GET, "/api/announcements", "/api/announcements/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/announcements").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.PUT, "/api/announcements/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/announcements/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.GET, "/api/attendance", "/api/attendance/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/attendance").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.PUT, "/api/attendance/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/attendance/**").hasAnyRole("ADMIN", "TEACHER")
                        // Messages: teacher↔parent, inbox + delete
                        .requestMatchers(HttpMethod.POST, "/api/messages/teacher-to-parent").hasRole("TEACHER")
                        .requestMatchers(HttpMethod.POST, "/api/messages/parent-to-teacher").hasRole("PARENT")
                        .requestMatchers(HttpMethod.GET, "/api/messages/parent").hasRole("PARENT")
                        .requestMatchers(HttpMethod.GET, "/api/messages/teacher").hasRole("TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/messages/{id}").hasAnyRole("TEACHER", "PARENT", "ADMIN")
                        .requestMatchers("/api/me").permitAll()

                        // Register/Login → SPESIFIK!
                        .requestMatchers("/api/teachers/register").permitAll()
                        .requestMatchers("/api/students/register").permitAll()
                        .requestMatchers("/api/parents/register").permitAll()
                        .requestMatchers("/api/admin/register").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()

                        // Parents: list for ADMIN/TEACHER; other routes for PARENT
                        .requestMatchers(HttpMethod.GET, "/api/parents").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.GET, "/api/subjects").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/subjects/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/subjects").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/subjects/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/subjects/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/classes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/classes/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/classes").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/classes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/classes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/grades").permitAll()

                        // Role-based (only unmatched student routes — PUT/DELETE already above)
                        .requestMatchers("/api/teachers/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers("/api/students/profile").hasRole("STUDENT")
                        .requestMatchers("/api/parents/**").hasRole("PARENT")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000"));
        config.setAllowedMethods(Arrays.asList("*"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
