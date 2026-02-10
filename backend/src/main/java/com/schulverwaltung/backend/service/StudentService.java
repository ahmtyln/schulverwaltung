package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.RegisterRequestDto;
import com.schulverwaltung.backend.DTOs.RegisterResponseDto;
import com.schulverwaltung.backend.enums.Role;
import com.schulverwaltung.backend.model.Student;
import com.schulverwaltung.backend.model.User;
import com.schulverwaltung.backend.repository.StudentRepository;
import com.schulverwaltung.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterResponseDto register(RegisterRequestDto request){

        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username existiert bereits.");
        }
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email existiert bereits.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT);

        Student student = new Student();
        student.setName(request.getName());
        student.setSurname(request.getSurname());
        student.setUser(user);

        studentRepository.save(student);

        RegisterResponseDto response = new RegisterResponseDto();
        response.setName(student.getName());
        response.setSurname(student.getSurname());
        response.setEmail(student.getUser().getEmail());

        return response;
    }

}
