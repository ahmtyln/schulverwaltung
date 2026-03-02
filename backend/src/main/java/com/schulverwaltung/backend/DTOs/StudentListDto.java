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
    private String studentId;
    private String email;
    private String phone;
    private String address;
    private int grade;
    private String className;
    private String sex; // MALE, FEMALE for dashboard stats
}
