package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.GradeListItemDto;
import com.schulverwaltung.backend.model.Grade;
import com.schulverwaltung.backend.repository.GradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
public class GradeController {

    private final GradeRepository gradeRepository;

    @GetMapping
    public ResponseEntity<List<GradeListItemDto>> getAllGrades() {
        List<GradeListItemDto> list = gradeRepository.findAll().stream()
                .map(g -> GradeListItemDto.builder()
                        .id(g.getId())
                        .level(g.getLevel())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }
}
