package com.schulverwaltung.backend.DTOs;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentListDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private int grade;
    private String className;
    private LocalDateTime createdAt;
}
