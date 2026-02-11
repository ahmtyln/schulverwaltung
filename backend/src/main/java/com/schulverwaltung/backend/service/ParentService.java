package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.RegisterRequestDto;
import com.schulverwaltung.backend.DTOs.RegisterResponseDto;
import com.schulverwaltung.backend.enums.Role;
import com.schulverwaltung.backend.model.Parent;
import com.schulverwaltung.backend.model.User;
import com.schulverwaltung.backend.repository.ParentRepository;
import com.schulverwaltung.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParentService {
    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
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
        user.setRole(Role.PARENT);

        Parent parent = new Parent();
        parent.setName(request.getName());
        parent.setSurname(request.getSurname());
        parent.setUser(user);

        parentRepository.save(parent);

        RegisterResponseDto responseDto = new RegisterResponseDto();
        responseDto.setName(parent.getName());
        responseDto.setSurname(parent.getSurname());
        responseDto.setEmail(parent.getUser().getEmail());

        return responseDto;
    }

    public RegisterResponseDto profileParent(Authentication authentication){
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new UsernameNotFoundException("User ist nicht gefunden!"));
        Parent parent = parentRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Parent ist nicht gefunden."));

        RegisterResponseDto response = new RegisterResponseDto();

        response.setEmail(parent.getUser().getEmail());
        response.setSurname(parent.getSurname());
        response.setName(parent.getName());

        return response;
    }
}
