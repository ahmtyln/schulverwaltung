package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.AddAnnouncementRequestDto;
import com.schulverwaltung.backend.DTOs.AnnouncementListDto;
import com.schulverwaltung.backend.DTOs.UpdateAnnouncementRequestDto;
import com.schulverwaltung.backend.service.AnnouncementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<List<AnnouncementListDto>> getAllAnnouncements(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long teacherId) {
        if (studentId != null) {
            return ResponseEntity.ok(announcementService.getAnnouncementsByStudentId(studentId));
        }
        if (teacherId != null) {
            return ResponseEntity.ok(announcementService.getAnnouncementsByTeacherId(teacherId));
        }
        if (classId != null) {
            return ResponseEntity.ok(announcementService.getAnnouncementsByClassId(classId));
        }
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }

    @PostMapping
    public ResponseEntity<AnnouncementListDto> createAnnouncement(@Valid @RequestBody AddAnnouncementRequestDto request) {
        return ResponseEntity.ok(announcementService.createAnnouncement(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementListDto> updateAnnouncement(@PathVariable Long id, @Valid @RequestBody UpdateAnnouncementRequestDto request) {
        return ResponseEntity.ok(announcementService.updateAnnouncement(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }
}
