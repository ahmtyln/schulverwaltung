package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class RegisterRequestDto {
    @NotBlank(message = "Das Feld muss ausgefüllt werden.")
    @Size(min = 3,max = 100)
    private String username;

    @NotBlank(message = "Das Feld muss ausgefüllt werden.")
    @Email(message = "Die eingegebene E-Mail-Adresse ist ungültig.")
    private String email;

    @NotBlank(message = "Das Feld muss ausgefüllt werden.")
    @Size(min = 2, message = "Das Feld muss mindestens 2 Character enthalten.")
    private String password;

    @NotBlank
    private String name;

    @NotBlank
    private String surname;
}
