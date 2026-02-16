package com.schulverwaltung.backend.mapper;

import com.schulverwaltung.backend.DTOs.TeacherListDto;
import com.schulverwaltung.backend.model.Teacher;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TeacherListMapper {
    public TeacherListDto toTeacherListDto(Teacher teacher){
        List<String> lessonNames = teacher.getLessons().stream().map(l -> l.getName()).toList();

        return TeacherListDto.builder()
                .id(teacher.getId())
                .fullName(teacher.getName() + " " + teacher.getSurname())
                .email(teacher.getUser().getEmail())
                .phone(teacher.getPhone())
                .lessons(lessonNames)
                .createdAt(teacher.getCreatedAt())
                .build();
    }
}
