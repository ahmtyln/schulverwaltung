package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.*;
import com.schulverwaltung.backend.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
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

    @GetMapping
    public ResponseEntity<List<TeacherResponseDto>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherResponseDto> getOneTeacher(@PathVariable Long id){
        return ResponseEntity.ok(teacherService.getOneTeacher(id));
    }

    @PostMapping
    public ResponseEntity<TeacherResponseDto> createTeacher(@RequestBody @Valid AddTeacherRequestDto dto) {
        return ResponseEntity.ok(teacherService.createTeacher(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeacherResponseDto> updateTeacher(@PathVariable Long id, @RequestBody UpdateTeacherRequestDto request) {
        return ResponseEntity.ok(teacherService.updateTeacher(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/{id}/schedule")
    public ResponseEntity<List<LessonScheduleDto>> getTeacherSchedule(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.getTeacherSchedule(id));
    }


}
