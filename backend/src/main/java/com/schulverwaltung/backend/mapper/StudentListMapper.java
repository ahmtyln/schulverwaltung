package com.schulverwaltung.backend.mapper;

import com.schulverwaltung.backend.DTOs.StudentListDto;
import com.schulverwaltung.backend.model.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentListMapper {
    public StudentListDto toStudentListDto(Student student){
        return StudentListDto.builder()
                .id(student.getId())
                .fullName(student.getName()+ " " + student.getSurname())
                .email(student.getUser().getEmail())
                .grade(student.getGrade().getLevel())
                .className(student.getAClass().getName())
                .phone(student.getPhone())
                .createdAt(student.getCreatedAt())
                .build();
    }
}
