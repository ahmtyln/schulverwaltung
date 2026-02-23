package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTeacherRequestDto {
    @NotNull
    private Long id;
    private String name;
    private String surname;
    private String phone;
    private List<Long> lessonIds;
}
