package com.schulverwaltung.backend.exceptions;

import com.schulverwaltung.backend.DTOs.ErrorResponseDto;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDto> handleEmailAlreadyExist(EmailAlreadyExistsException ex){
        ErrorResponseDto error = new ErrorResponseDto(
                "EMAIL_ALREADY_EXISTS",
                ex.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDto> handleUsernameAlreadyExist(UsernameAlreadyExistsException ex) {
        ErrorResponseDto error = new ErrorResponseDto(
                "USERNAME_ALREADY_EXISTS",
                ex.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleUsernameNotFound(UsernameNotFoundException ex) {
        ErrorResponseDto error = new ErrorResponseDto(
                "USER_NOT_FOUND",
                ex.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDto> handleBadCredentials(BadCredentialsException ex) {
        ErrorResponseDto error = new ErrorResponseDto(
                "BAD_CREDENTIALS",
                ex.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponseDto> handleRuntime(RuntimeException ex) {
        ErrorResponseDto error = new ErrorResponseDto(
                "BAD_REQUEST",
                ex.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

}
