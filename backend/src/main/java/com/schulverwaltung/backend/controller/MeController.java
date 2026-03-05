package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.MeDto;
import com.schulverwaltung.backend.service.MeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MeController {

    private final MeService meService;

    @GetMapping("/me")
    public ResponseEntity<MeDto> me(Authentication authentication) {
        return ResponseEntity.ok(meService.getCurrentUser(authentication));
    }
}
