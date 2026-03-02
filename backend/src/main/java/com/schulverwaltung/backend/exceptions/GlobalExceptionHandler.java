package com.schulverwaltung.backend.exceptions;

import com.schulverwaltung.backend.DTOs.ErrorResponseDto;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.dao.DataIntegrityViolationException;
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

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponseDto> handleDataIntegrity(DataIntegrityViolationException ex) {
        String message = ex.getMessage() != null && ex.getMessage().contains("Duplicate entry")
                ? "This value is already in use (e.g. phone number). Please use a different one."
                : "Data constraint violation. Check that values are unique where required.";
        ErrorResponseDto error = new ErrorResponseDto(
                "CONFLICT",
                message,
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(org.hibernate.LazyInitializationException.class)
    public ResponseEntity<ErrorResponseDto> handleLazyInit(org.hibernate.LazyInitializationException ex) {
        ErrorResponseDto error = new ErrorResponseDto(
                "SERVER_ERROR",
                "A temporary error occurred. Please try again.",
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
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
