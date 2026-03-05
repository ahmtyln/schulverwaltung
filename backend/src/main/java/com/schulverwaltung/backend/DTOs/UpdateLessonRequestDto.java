package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateLessonRequestDto {
    @NotNull
    private Long id;
    private String name;
    private String day;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long subjectId;
    private Long classId;
    private Long teacherId;
}
