package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.AuthResponseDto;
import com.schulverwaltung.backend.DTOs.LoginRequestDto;
import com.schulverwaltung.backend.model.User;
import com.schulverwaltung.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.function.Supplier;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    public AuthResponseDto login (LoginRequestDto request){
        AuthResponseDto authResponseDto = new AuthResponseDto();

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new UsernameNotFoundException("Benutzer ist nicht gefunden!"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new BadCredentialsException("Ungültige Password");
        }

        String token =  jwtService.generateToken(user.getUsername(),user.getRole());

        authResponseDto.setToken(token);
        authResponseDto.setRole(user.getRole().name());

        return authResponseDto;

    }
}
