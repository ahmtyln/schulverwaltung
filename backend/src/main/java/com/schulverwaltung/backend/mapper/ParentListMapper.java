package com.schulverwaltung.backend.mapper;

import com.schulverwaltung.backend.DTOs.ParentListDto;
import com.schulverwaltung.backend.model.Parent;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ParentListMapper {
    public ParentListDto toParentListDto(Parent parent){
        List<String> studentNames = parent.getStudents().stream().map(s->s.getName() + " " + s.getSurname()).toList();
        return ParentListDto.builder()
                .id(parent.getId())
                .fullName(parent.getName() + " " + parent.getSurname())
                .email(parent.getUser().getEmail())
                .phone(parent.getPhone())
                .studentNames(studentNames)
                .createdAt(parent.getCreatedAt())
                .build();
    }
}
