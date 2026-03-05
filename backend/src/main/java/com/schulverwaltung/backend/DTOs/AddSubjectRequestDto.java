package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddSubjectRequestDto {
    @NotBlank(message = "Name is required")
    private String name;
    private Long teacherId;
}
