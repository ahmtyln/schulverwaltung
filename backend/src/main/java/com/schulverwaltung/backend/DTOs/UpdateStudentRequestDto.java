package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateStudentRequestDto {
    @NotNull(message = "StudentId ist erforderlich.")
    private Long id;

    @NotBlank(message = "NameBereich ist erforderlich.")
    private String name;

    @NotBlank(message = "SurnameBereich ist erforderlich.")
    private String surname;

    @NotBlank(message = "AddressBereich ist erforderlich.")
    private String address;

    @NotBlank(message = "PhoneBereich ist erforderlich.")
    private String phone;

    private String className;

    private int gradeLevel;
}
