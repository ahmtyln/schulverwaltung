package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.RegisterRequestDto;
import com.schulverwaltung.backend.DTOs.RegisterResponseDto;
import com.schulverwaltung.backend.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {
    private final TeacherService teacherService;
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> register(@Valid @RequestBody RegisterRequestDto request){
        return ResponseEntity.ok(teacherService.register(request));
    }

    @GetMapping("/profile")
    public ResponseEntity<RegisterResponseDto> teacherProfile(Authentication authentication){
        return ResponseEntity.ok(teacherService.teacherProfile(authentication));
    }
}
