package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.RegisterRequestDto;
import com.schulverwaltung.backend.DTOs.RegisterResponseDto;
import com.schulverwaltung.backend.model.User;
import com.schulverwaltung.backend.repository.ParentRepository;
import com.schulverwaltung.backend.repository.UserRepository;
import com.schulverwaltung.backend.service.ParentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parents")
@RequiredArgsConstructor
public class ParentController {
    private final ParentService parentService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> register(@Valid @RequestBody RegisterRequestDto request){
        return ResponseEntity.ok(parentService.register(request));
    }

    @GetMapping("/profile")
    public ResponseEntity<RegisterResponseDto> profileParent(Authentication authentication){
        return ResponseEntity.ok(parentService.profileParent(authentication));
    }
}
