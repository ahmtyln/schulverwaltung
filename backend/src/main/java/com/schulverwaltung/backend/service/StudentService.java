package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.ErrorResponseDto;
import com.schulverwaltung.backend.DTOs.RegisterRequestDto;
import com.schulverwaltung.backend.DTOs.RegisterResponseDto;
import com.schulverwaltung.backend.enums.Role;
import com.schulverwaltung.backend.exceptions.EmailAlreadyExistsException;
import com.schulverwaltung.backend.exceptions.UsernameAlreadyExistsException;
import com.schulverwaltung.backend.model.Student;
import com.schulverwaltung.backend.model.User;
import com.schulverwaltung.backend.repository.StudentRepository;
import com.schulverwaltung.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterResponseDto register(RegisterRequestDto request){

        if(userRepository.existsByUsername(request.getUsername())){
            throw new UsernameAlreadyExistsException("Username existiert bereits.");
        }
        if(userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistsException("Email existiert bereits.");
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

    public RegisterResponseDto profileStudent(Authentication authentication){
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Benutzer ist nicht gefunden."));

        Student student = studentRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Student ist nicht gefunden."));

        RegisterResponseDto response = new RegisterResponseDto();

        response.setEmail(student.getUser().getEmail());
        response.setSurname(student.getSurname());
        response.setName(student.getName());

        return response;
    }

}
