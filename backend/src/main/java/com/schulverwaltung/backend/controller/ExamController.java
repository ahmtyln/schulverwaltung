package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.AddExamRequestDto;
import com.schulverwaltung.backend.DTOs.ExamListDto;
import com.schulverwaltung.backend.DTOs.UpdateExamRequestDto;
import com.schulverwaltung.backend.service.ExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @GetMapping
    public ResponseEntity<List<ExamListDto>> getAllExams(
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long teacherId) {
        if (studentId != null) {
            return ResponseEntity.ok(examService.getExamsByStudentId(studentId));
        }
        if (teacherId != null) {
            return ResponseEntity.ok(examService.getExamsByTeacherId(teacherId));
        }
        if (classId != null) {
            return ResponseEntity.ok(examService.getExamsByClassId(classId));
        }
        return ResponseEntity.ok(examService.getAllExams());
    }

    @PostMapping
    public ResponseEntity<ExamListDto> createExam(@Valid @RequestBody AddExamRequestDto request) {
        return ResponseEntity.ok(examService.createExam(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamListDto> updateExam(@PathVariable Long id,
                                                  @Valid @RequestBody UpdateExamRequestDto request) {
        return ResponseEntity.ok(examService.updateExam(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.ok().build();
    }
}

