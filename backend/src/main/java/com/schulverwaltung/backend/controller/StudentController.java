package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.*;
import com.schulverwaltung.backend.model.Student;
import com.schulverwaltung.backend.model.User;
import com.schulverwaltung.backend.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> register(@Valid @RequestBody RegisterRequestDto request){
        return ResponseEntity.ok(studentService.register(request));
    }

    @GetMapping("/profile")
    public ResponseEntity<RegisterResponseDto> profileStudent(Authentication authentication){
        return ResponseEntity.ok(studentService.profileStudent(authentication));
    }

    @GetMapping
    public ResponseEntity<List<StudentListDto>> getAllStudents(
            @RequestParam(required = false) Long teacherId) {
        if (teacherId != null) {
            return ResponseEntity.ok(studentService.getStudentsByTeacherId(teacherId));
        }
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDetailDto> getOneStudent(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getOneStudent(id));
    }

    @PostMapping
    public ResponseEntity<StudentResponseDto> createStudent(@Valid @RequestBody AddStudentRequestDto requestDto) {
        return ResponseEntity.ok(studentService.createStudent(requestDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDto> updateStudent(@PathVariable Long id, @Valid @RequestBody AddStudentRequestDto requestDto) {
        return ResponseEntity.ok(studentService.updateStudent(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        studentService.deleteById(id);
        return ResponseEntity.ok("Student deleted successfully!");
    }

    @GetMapping("/{id}/schedule")
    public ResponseEntity<List<LessonScheduleDto>> getStudentSchedule(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentSchedule(id));
    }

}
