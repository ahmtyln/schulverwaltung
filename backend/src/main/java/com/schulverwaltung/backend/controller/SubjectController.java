package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.AddSubjectRequestDto;
import com.schulverwaltung.backend.DTOs.SubjectListDto;
import com.schulverwaltung.backend.DTOs.UpdateSubjectRequestDto;
import com.schulverwaltung.backend.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public ResponseEntity<List<SubjectListDto>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    @PostMapping
    public ResponseEntity<SubjectListDto> createSubject(@Valid @RequestBody AddSubjectRequestDto request) {
        return ResponseEntity.ok(subjectService.createSubject(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubjectListDto> updateSubject(@PathVariable Long id,
                                                       @RequestBody UpdateSubjectRequestDto request) {
        return ResponseEntity.ok(subjectService.updateSubject(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }
}
