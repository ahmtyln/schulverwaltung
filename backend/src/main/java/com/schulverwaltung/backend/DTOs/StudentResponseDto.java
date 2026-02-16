package com.schulverwaltung.backend.DTOs;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentResponseDto {
    private Long id;
    private String fullName;
    private String email;
    private String className;
    private int gradeLevel;
    private LocalDateTime createdAt;
}
