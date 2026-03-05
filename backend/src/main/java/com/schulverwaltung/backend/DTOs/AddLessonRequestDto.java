package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddLessonRequestDto {
    @NotBlank
    private String name;
    private String day; // MONDAY, TUESDAY, ...
    @NotNull
    private LocalDateTime startTime;
    @NotNull
    private LocalDateTime endTime;
    @NotNull
    private Long subjectId;
    @NotNull
    private Long classId;
    @NotNull
    private Long teacherId;
}
