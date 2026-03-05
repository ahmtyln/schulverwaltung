package com.schulverwaltung.backend.controller;

import com.schulverwaltung.backend.DTOs.CreateMessageRequestDto;
import com.schulverwaltung.backend.DTOs.MessageDto;
import com.schulverwaltung.backend.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // TEACHER → Parent (öğrencinin velisi)
    @PostMapping("/teacher-to-parent")
    public ResponseEntity<MessageDto> sendFromTeacherToParent(
            Authentication authentication,
            @Valid @RequestBody CreateMessageRequestDto request
    ) {
        return ResponseEntity.ok(messageService.sendFromTeacherToParent(authentication, request));
    }

    // PARENT → Teacher (öğrencinin sınıf öğretmeni)
    @PostMapping("/parent-to-teacher")
    public ResponseEntity<MessageDto> sendFromParentToTeacher(
            Authentication authentication,
            @Valid @RequestBody CreateMessageRequestDto request
    ) {
        return ResponseEntity.ok(messageService.sendFromParentToTeacher(authentication, request));
    }

    // Parent kendi gelen mesajlarını görür
    @GetMapping("/parent")
    public ResponseEntity<List<MessageDto>> getMessagesForParent(Authentication authentication) {
        return ResponseEntity.ok(messageService.getMessagesForCurrentParent(authentication));
    }

    // Teacher kendi gelen mesajlarını görür
    @GetMapping("/teacher")
    public ResponseEntity<List<MessageDto>> getMessagesForTeacher(Authentication authentication) {
        return ResponseEntity.ok(messageService.getMessagesForCurrentTeacher(authentication));
    }

    // Ortak silme endpoint'i (sender veya receiver veya ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(Authentication authentication, @PathVariable Long id) {
        messageService.deleteMessage(authentication, id);
        return ResponseEntity.noContent().build();
    }
}

