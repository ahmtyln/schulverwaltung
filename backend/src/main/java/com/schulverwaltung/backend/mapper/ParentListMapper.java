package com.schulverwaltung.backend.mapper;

import com.schulverwaltung.backend.DTOs.ParentListDto;
import com.schulverwaltung.backend.DTOs.ParentSummaryDto;
import com.schulverwaltung.backend.model.Parent;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ParentListMapper {
    public ParentListDto toParentListDto(Parent parent){
        List<String> studentNames = parent.getStudents().stream().map(s -> (s.getName() + " " + (s.getSurname() != null ? s.getSurname() : "")).trim()).toList();
        List<Long> studentIds = parent.getStudents().stream().map(s -> s.getId()).toList();
        String email = parent.getUser() != null ? parent.getUser().getEmail() : null;
        return ParentListDto.builder()
                .id(parent.getId())
                .name(parent.getName())
                .surname(parent.getSurname())
                .email(email)
                .phone(parent.getPhone())
                .address(parent.getAddress())
                .studentNames(studentNames)
                .studentIds(studentIds)
                .build();
    }

    public ParentSummaryDto parentToSummary(Parent parent){
        return ParentSummaryDto.builder()
                .id(parent.getId())
                .fullName(parent.getName() + " " + parent.getSurname())
                .phone(parent.getPhone())
                .build();
    }
}
