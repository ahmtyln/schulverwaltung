package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddAttendanceRequestDto {
    @NotNull
    private LocalDateTime date;
    @NotNull
    private Long lessonId;
    /** Student IDs to mark as absent (only absent students are added). */
    @NotNull
    private List<Long> studentIds;
}
