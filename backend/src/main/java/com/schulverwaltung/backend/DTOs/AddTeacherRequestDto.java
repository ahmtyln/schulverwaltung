package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddTeacherRequestDto {
    @NotBlank
    private String name;

    @NotBlank
    private String surname;

    @Email
    @NotBlank
    private String email;

    @NotBlank @Size(min=3)
    private String password;

    @NotBlank
    private String phone;

    private String address;

    private String bloodType;

    private List<Long> lessonIds;
}
