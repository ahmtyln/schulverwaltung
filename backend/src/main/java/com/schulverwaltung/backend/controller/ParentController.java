package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.ParentListDto;
import com.schulverwaltung.backend.DTOs.RegisterRequestDto;
import com.schulverwaltung.backend.DTOs.RegisterResponseDto;
import com.schulverwaltung.backend.service.ParentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parents")
@RequiredArgsConstructor
public class ParentController {
    private final ParentService parentService;

    @GetMapping
    public ResponseEntity<List<ParentListDto>> getAllParents() {
        return ResponseEntity.ok(parentService.getAllParents());
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> register(@Valid @RequestBody RegisterRequestDto request){
        return ResponseEntity.ok(parentService.register(request));
    }

    @GetMapping("/profile")
    public ResponseEntity<RegisterResponseDto> profileParent(Authentication authentication){
        return ResponseEntity.ok(parentService.profileParent(authentication));
    }
}
