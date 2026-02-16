package com.schulverwaltung.backend.DTOs;

import com.schulverwaltung.backend.model.Student;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentListDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private List<String> studentNames;
    private LocalDateTime createdAt;
}
