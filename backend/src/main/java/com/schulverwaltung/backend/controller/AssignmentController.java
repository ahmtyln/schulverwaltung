package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.AddAssignmentRequestDto;
import com.schulverwaltung.backend.DTOs.AssignmentListDto;
import com.schulverwaltung.backend.DTOs.UpdateAssignmentRequestDto;
import com.schulverwaltung.backend.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping
    public ResponseEntity<List<AssignmentListDto>> getAllAssignments(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long teacherId) {
        if (studentId != null) {
            return ResponseEntity.ok(assignmentService.getAssignmentsByStudentId(studentId));
        }
        if (teacherId != null) {
            return ResponseEntity.ok(assignmentService.getAssignmentsByTeacherId(teacherId));
        }
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @PostMapping
    public ResponseEntity<AssignmentListDto> createAssignment(@Valid @RequestBody AddAssignmentRequestDto request) {
        return ResponseEntity.ok(assignmentService.createAssignment(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssignmentListDto> updateAssignment(@PathVariable Long id,
                                                              @Valid @RequestBody UpdateAssignmentRequestDto request) {
        return ResponseEntity.ok(assignmentService.updateAssignment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok().build();
    }
}

