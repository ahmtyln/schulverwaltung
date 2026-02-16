package com.schulverwaltung.backend.DTOs;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherListDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private List<String> lessons;
    private LocalDateTime createdAt;
}
