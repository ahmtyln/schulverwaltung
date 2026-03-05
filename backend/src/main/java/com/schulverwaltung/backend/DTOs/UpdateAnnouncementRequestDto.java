package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateAnnouncementRequestDto {
    @NotNull
    private Long id;
    private String title;
    private String description;
    private LocalDateTime date;
    private Long classId;
}
