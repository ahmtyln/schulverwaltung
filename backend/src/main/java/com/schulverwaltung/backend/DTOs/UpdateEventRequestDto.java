package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateEventRequestDto {
    @NotNull
    private Long id;
    private String title;
    private String description;
    private LocalDateTime date;
    private Long classId;
    private BigDecimal price;
}
