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
    private String name;
    private String surname;
    private String phone;
    private String email;
    private String address;
    private String bloodType;
    private List<Long> lessonIds;
}
