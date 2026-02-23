package com.schulverwaltung.backend.DTOs;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ParentResponseDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private List<String> students;
}
