package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddEventRequestDto {
    @NotBlank
    private String title;
    private String description;
    @NotNull
    private LocalDateTime date;
    @NotNull
    private Long classId;
    private BigDecimal price;
}
