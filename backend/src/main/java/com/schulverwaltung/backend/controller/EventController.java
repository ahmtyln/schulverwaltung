package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.AddEventRequestDto;
import com.schulverwaltung.backend.DTOs.EventListDto;
import com.schulverwaltung.backend.DTOs.UpdateEventRequestDto;
import com.schulverwaltung.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventListDto>> getAllEvents(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long teacherId) {
        if (studentId != null) {
            return ResponseEntity.ok(eventService.getEventsByStudentId(studentId));
        }
        if (teacherId != null) {
            return ResponseEntity.ok(eventService.getEventsByTeacherId(teacherId));
        }
        if (classId != null) {
            return ResponseEntity.ok(eventService.getEventsByClassId(classId));
        }
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @PostMapping
    public ResponseEntity<EventListDto> createEvent(@Valid @RequestBody AddEventRequestDto request) {
        return ResponseEntity.ok(eventService.createEvent(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventListDto> updateEvent(@PathVariable Long id, @Valid @RequestBody UpdateEventRequestDto request) {
        return ResponseEntity.ok(eventService.updateEvent(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
