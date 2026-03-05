package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.AddAttendanceRequestDto;
import com.schulverwaltung.backend.DTOs.AttendanceListDto;
import com.schulverwaltung.backend.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<AttendanceListDto>> getAllAttendances(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long teacherId) {
        if (studentId != null) {
            return ResponseEntity.ok(attendanceService.getAttendancesByStudentId(studentId));
        }
        if (teacherId != null) {
            return ResponseEntity.ok(attendanceService.getAttendancesByTeacherId(teacherId));
        }
        return ResponseEntity.ok(attendanceService.getAllAttendances());
    }

    /** Add absent students for a lesson on a given date (only absent records are created). */
    @PostMapping
    public ResponseEntity<List<AttendanceListDto>> createAbsent(@Valid @RequestBody AddAttendanceRequestDto request) {
        return ResponseEntity.ok(attendanceService.createAbsent(request));
    }
}
