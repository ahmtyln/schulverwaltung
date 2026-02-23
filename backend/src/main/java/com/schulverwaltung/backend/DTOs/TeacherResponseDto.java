package com.schulverwaltung.backend.DTOs;

import lombok.*;

import java.util.List;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeacherResponseDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private List<String> lessons;
}
