package com.schulverwaltung.backend.DTOs;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateSubjectRequestDto {
    private String name;
    private Long teacherId;
}
