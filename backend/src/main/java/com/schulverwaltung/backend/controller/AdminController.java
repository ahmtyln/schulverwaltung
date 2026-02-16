package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.*;
import com.schulverwaltung.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> register(@Valid @RequestBody RegisterRequestDto request){
        return ResponseEntity.ok(adminService.register(request));
    }

    @GetMapping("/profile")
    public ResponseEntity<RegisterResponseDto> adminProfile(Authentication authentication){
        return ResponseEntity.ok(adminService.adminProfile(authentication));
    }

    @GetMapping("/students")
    public ResponseEntity<Page<StudentListDto>> getAllStudents(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page,size, Sort.by("createdAt").descending());

        return ResponseEntity.ok(adminService.getAllStudents(pageable));

    }

    @GetMapping("/teachers")
    public ResponseEntity<Page<TeacherListDto>> getAllTeachers(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page,size, Sort.by("createdAt").descending());

        return ResponseEntity.ok(adminService.getAllTeachers(pageable));

    }

    @GetMapping("/parents")
    public ResponseEntity<Page<ParentListDto>> getAllParents(@RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page,size, Sort.by("createdAt").descending());

        return ResponseEntity.ok(adminService.getAllParents(pageable));

    }

    @PostMapping("/students")
    public ResponseEntity<StudentResponseDto> addStudent(@Valid @RequestBody AddStudentRequestDto request){
        return ResponseEntity.ok(adminService.addStudent(request));
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<StudentResponseDto> updateStudent(@PathVariable Long id, @Valid @RequestBody UpdateStudentRequestDto request){
        return ResponseEntity.ok(adminService.updateStudent(id,request));
    }

    @DeleteMapping("/students/{id}")
    public void deleteStudent(@Valid @PathVariable Long id){
        adminService.deleteStudent(id);
    }


}
