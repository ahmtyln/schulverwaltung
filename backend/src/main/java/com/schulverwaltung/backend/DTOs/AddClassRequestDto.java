package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddClassRequestDto {
    private String name;
    private Integer capacity;
    @NotNull(message = "Grade is required")
    private Long gradeId;
    private Long teacherId;
}
