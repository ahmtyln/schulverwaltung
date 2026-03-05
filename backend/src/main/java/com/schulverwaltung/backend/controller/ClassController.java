package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.AddClassRequestDto;
import com.schulverwaltung.backend.DTOs.ClassListDto;
import com.schulverwaltung.backend.DTOs.UpdateClassRequestDto;
import com.schulverwaltung.backend.service.ClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @GetMapping
    public ResponseEntity<List<ClassListDto>> getAllClasses(
            @RequestParam(required = false) Long teacherId) {
        if (teacherId != null) {
            return ResponseEntity.ok(classService.getClassesByTeacherId(teacherId));
        }
        return ResponseEntity.ok(classService.getAllClasses());
    }

    @PostMapping
    public ResponseEntity<ClassListDto> createClass(@Valid @RequestBody AddClassRequestDto request) {
        return ResponseEntity.ok(classService.createClass(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassListDto> updateClass(@PathVariable Long id,
                                                     @RequestBody UpdateClassRequestDto request) {
        return ResponseEntity.ok(classService.updateClass(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable(name = "id") Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Class id is required");
        }
        classService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }
}
