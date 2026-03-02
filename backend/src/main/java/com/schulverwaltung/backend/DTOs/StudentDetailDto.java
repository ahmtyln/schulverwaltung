package com.schulverwaltung.backend.DTOs;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDetailDto {
    private Long id;
    private String fullName;
    private String studentId;
    private String email;
    private String phone;
    private String address;
    private String className;     // Aclass.name
    private Integer gradeLevel;   // Grade.level
    private String bloodType;
}

