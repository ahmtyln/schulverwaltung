package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddStudentRequestDto {
    @NotBlank(message = "NameBereich ist erforderlich.")
    private String name;

    @NotBlank(message = "SurnameBereich ist erforderlich.")
    private String surname;

    @Email(message = "Gültige Email")
    @NotBlank
    private String email;

    @Size(min = 6, message = "Password muss mindestens 6 Character sein.")
    private String password;

    private String phone;

    private String address;

    private String bloodType;

    private String className;

    private Integer gradeLevel;


    private Long parentId;
}
