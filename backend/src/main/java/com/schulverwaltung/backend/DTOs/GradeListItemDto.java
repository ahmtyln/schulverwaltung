package com.schulverwaltung.backend.DTOs;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeListItemDto {
    private Long id;
    private Integer level;
}
