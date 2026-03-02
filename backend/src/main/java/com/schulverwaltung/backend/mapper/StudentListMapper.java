package com.schulverwaltung.backend.mapper;

import com.schulverwaltung.backend.DTOs.ParentSummaryDto;
import com.schulverwaltung.backend.DTOs.StudentListDto;
import com.schulverwaltung.backend.DTOs.StudentResponseDto;
import com.schulverwaltung.backend.model.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StudentListMapper {
    private final ParentListMapper parentListMapper;

    public StudentListDto toStudentListDto(Student student){
        int grade = student.getGrade() != null ? student.getGrade().getLevel() : 0;
        String className = student.getAClass() != null ? student.getAClass().getName() : "";
        String email = student.getUser() != null ? student.getUser().getEmail() : null;
        String sex = student.getSex() != null ? student.getSex().name() : null;
        return StudentListDto.builder()
                .id(student.getId())
                .fullName(student.getName() + " " + (student.getSurname() != null ? student.getSurname() : ""))
                .email(email)
                .grade(grade)
                .className(className)
                .phone(student.getPhone())
                .sex(sex)
                .build();
    }


    public StudentResponseDto toResponseDto(Student student) {
        return StudentResponseDto.builder()
                .fullName(student.getName() + " " + student.getSurname())
                .email(student.getUser().getEmail())
                .phone(student.getPhone())
                .address(student.getAddress())
                .bloodType(student.getBloodType())
                .className(student.getAClass() != null ? student.getAClass().getName() : "No ClassName")
                .gradeLevel(student.getGrade() != null ? student.getGrade().getLevel() : 0)
                .createdAt(student.getCreatedAt())
                .parent(student.getParent() != null ?
                        ParentSummaryDto.builder()
                                .id(student.getParent().getId())
                                .fullName(student.getParent().getName() + " " + student.getParent().getSurname())
                                .phone(student.getParent().getPhone())
                                .build() : null)
                .build();
    }
}
