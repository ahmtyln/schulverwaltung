package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateResultRequestDto {
    @Min(0)
    @Max(100)
    private Integer score;
}
