package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.AddLessonRequestDto;
import com.schulverwaltung.backend.DTOs.LessonListDto;
import com.schulverwaltung.backend.DTOs.UpdateLessonRequestDto;
import com.schulverwaltung.backend.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @GetMapping
    public ResponseEntity<List<LessonListDto>> getAllLessons(
            @RequestParam(required = false) Long teacherId) {
        if (teacherId != null) {
            return ResponseEntity.ok(lessonService.getLessonsByTeacherId(teacherId));
        }
        return ResponseEntity.ok(lessonService.getAllLessons());
    }

    @PostMapping
    public ResponseEntity<LessonListDto> createLesson(@Valid @RequestBody AddLessonRequestDto request) {
        return ResponseEntity.ok(lessonService.createLesson(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LessonListDto> updateLesson(@PathVariable Long id, @Valid @RequestBody UpdateLessonRequestDto request) {
        return ResponseEntity.ok(lessonService.updateLesson(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}
