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
public class SubjectListDto {
    private Long id;
    private String name;
    private String teacherName;
    private Long teacherId;
}
