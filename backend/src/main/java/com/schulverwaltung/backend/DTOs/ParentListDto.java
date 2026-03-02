package com.schulverwaltung.backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentListDto {
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String phone;
    private String address;
    private List<String> studentNames;
    private List<Long> studentIds;
}
