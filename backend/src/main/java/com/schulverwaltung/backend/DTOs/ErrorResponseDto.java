package com.schulverwaltung.backend.DTOs;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponseDto {
    private String code;
    private String message;
    private LocalDateTime timestamp;
}
