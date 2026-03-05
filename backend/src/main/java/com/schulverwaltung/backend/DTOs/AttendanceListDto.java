package com.schulverwaltung.backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceListDto {
    private Long id;
    private Long studentId;
    private LocalDateTime date;
    private boolean present;
    private String studentName;
    private String lessonName;
}
