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

                        // Teachers (GET public for list/detail; POST/PUT/DELETE require ADMIN or TEACHER)
                        .requestMatchers(HttpMethod.GET, "/api/teachers").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/teachers/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/teachers").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.PUT, "/api/teachers/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/teachers/**").hasAnyRole("ADMIN", "TEACHER")

                        // Students: list/create public; update/delete for ADMIN/TEACHER
                        .requestMatchers(HttpMethod.GET, "/api/students").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/students").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/students/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/students/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/students/**").hasAnyRole("ADMIN", "TEACHER")

                        // Exams, Assignments, Results (sınav + not modülü)
                        .requestMatchers("/api/exams", "/api/exams/**").permitAll()
                        .requestMatchers("/api/assignments", "/api/assignments/**").permitAll()
                        .requestMatchers("/api/results", "/api/results/**").permitAll()
                        .requestMatchers("/api/lessons", "/api/lessons/**").permitAll()
                        .requestMatchers("/api/events", "/api/events/**").permitAll()
                        .requestMatchers("/api/announcements", "/api/announcements/**").permitAll()
                        .requestMatchers("/api/attendance", "/api/attendance/**").permitAll()
                        .requestMatchers("/api/me").permitAll()

                        // Register/Login → SPESIFIK!
                        .requestMatchers("/api/teachers/register").permitAll()
                        .requestMatchers("/api/students/register").permitAll()
                        .requestMatchers("/api/parents/register").permitAll()
                        .requestMatchers("/api/admin/register").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()

                        // Parents: list for ADMIN/TEACHER; other routes for PARENT
                        .requestMatchers(HttpMethod.GET, "/api/parents").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers("/api/subjects", "/api/subjects/**").permitAll()
                        .requestMatchers("/api/classes", "/api/classes/**").permitAll()

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
