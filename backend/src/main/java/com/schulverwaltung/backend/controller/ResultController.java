package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.AddResultRequestDto;
import com.schulverwaltung.backend.DTOs.ResultListDto;
import com.schulverwaltung.backend.DTOs.UpdateResultRequestDto;
import com.schulverwaltung.backend.service.ResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @GetMapping
    public ResponseEntity<List<ResultListDto>> getAllResults(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long teacherId) {
        if (studentId != null) {
            return ResponseEntity.ok(resultService.getResultsByStudentId(studentId));
        }
        if (teacherId != null) {
            return ResponseEntity.ok(resultService.getResultsByTeacherId(teacherId));
        }
        return ResponseEntity.ok(resultService.getAllResults());
    }

    @PostMapping
    public ResponseEntity<ResultListDto> createResult(@Valid @RequestBody AddResultRequestDto request) {
        return ResponseEntity.ok(resultService.createResult(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultListDto> updateResult(
            @PathVariable Long id,
            @Valid @RequestBody UpdateResultRequestDto request) {
        return ResponseEntity.ok(resultService.updateResult(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResult(@PathVariable Long id) {
        resultService.deleteResult(id);
        return ResponseEntity.ok().build();
    }
}

