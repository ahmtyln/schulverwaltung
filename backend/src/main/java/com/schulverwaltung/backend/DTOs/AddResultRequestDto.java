package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddResultRequestDto {
    @NotNull
    @Min(0)
    @Max(100)
    private Integer score;

    @NotNull
    private Long studentId;

    private Long examId;

    private Long assignmentId;
}

