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
public class AddAnnouncementRequestDto {
    @NotBlank
    private String title;
    private String description;
    @NotNull
    private LocalDateTime date;
    @NotNull
    private Long classId;
}
