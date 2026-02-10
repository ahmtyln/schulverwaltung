package com.schulverwaltung.backend.DTOs;

import com.schulverwaltung.backend.enums.UserSex;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
public class RegisterResponseDto {
    private String name;
    private String surname;
    private String email;
}

//private Long id;
//private String token;
//private String phone;
//private String adresse;
//private String bloodType;
//private String image;
//private UserSex sex;
//private LocalDateTime createdAt;
