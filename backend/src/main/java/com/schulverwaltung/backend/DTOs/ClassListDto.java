package com.schulverwaltung.backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassListDto {
    private Long id;
    private String name;
    private Integer capacity;
    private Integer gradeLevel;
    private String supervisorName;
    private Long gradeId;
    private Long teacherId;
}
