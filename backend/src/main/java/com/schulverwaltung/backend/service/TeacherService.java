package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.RegisterRequestDto;
import com.schulverwaltung.backend.DTOs.RegisterResponseDto;
import com.schulverwaltung.backend.enums.Role;
import com.schulverwaltung.backend.exceptions.EmailAlreadyExistsException;
import com.schulverwaltung.backend.exceptions.UsernameAlreadyExistsException;
import com.schulverwaltung.backend.model.Teacher;
import com.schulverwaltung.backend.model.User;
import com.schulverwaltung.backend.repository.TeacherRepository;
import com.schulverwaltung.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeacherService {
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
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
        user.setRole(Role.TEACHER);

        Teacher teacher = new Teacher();
        teacher.setName(request.getName());
        teacher.setSurname(request.getSurname());
        teacher.setUser(user);

        teacherRepository.save(teacher);

        RegisterResponseDto responseDto = new RegisterResponseDto();

        responseDto.setSurname(teacher.getSurname());
        responseDto.setEmail(teacher.getUser().getEmail());
        responseDto.setName(teacher.getName());

        return responseDto;
    }

    public RegisterResponseDto teacherProfile(Authentication authentication){
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Benutzer ist nicht gefunden!"));
        Teacher teacher = teacherRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Teacher ist nicht gefunden."));

        RegisterResponseDto responseDto = new RegisterResponseDto();

        responseDto.setSurname(teacher.getSurname());
        responseDto.setEmail(teacher.getUser().getEmail());
        responseDto.setName(teacher.getName());

        return responseDto;
    }
}
