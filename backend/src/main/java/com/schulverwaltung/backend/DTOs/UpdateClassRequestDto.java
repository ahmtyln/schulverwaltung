package com.schulverwaltung.backend.DTOs;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateClassRequestDto {
    private String name;
    private Integer capacity;
    private Long gradeId;
    private Long teacherId;
}
