package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.CreateMessageRequestDto;
import com.schulverwaltung.backend.DTOs.MessageDto;
import com.schulverwaltung.backend.enums.Role;
import com.schulverwaltung.backend.model.Parent;
import com.schulverwaltung.backend.model.Student;
import com.schulverwaltung.backend.model.Teacher;
import com.schulverwaltung.backend.model.Message;
import com.schulverwaltung.backend.model.User;
import com.schulverwaltung.backend.repository.MessageRepository;
import com.schulverwaltung.backend.repository.ParentRepository;
import com.schulverwaltung.backend.repository.StudentRepository;
import com.schulverwaltung.backend.repository.TeacherRepository;
import com.schulverwaltung.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final StudentRepository studentRepository;
    private final MessageRepository messageRepository;

    @Transactional
    public MessageDto sendFromTeacherToParent(Authentication authentication, CreateMessageRequestDto request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }
        String username = authentication.getName();
        User senderUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (senderUser.getRole() != Role.TEACHER) {
            throw new RuntimeException("Only TEACHER can send this message");
        }
        Teacher teacher = teacherRepository.findByUserId(senderUser.getId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Parent parent = student.getParent();
        if (parent == null) {
            throw new RuntimeException("Student has no parent");
        }

        // Basit güvenlik: öğrenci öğretmenin sınıflarından birine ait mi kontrol edilebilir (opsiyonel)

        User receiverUser = parent.getUser();
        if (receiverUser == null) {
            throw new RuntimeException("Parent has no user");
        }

        Message m = new Message();
        m.setText(request.getText());
        m.setSender(senderUser);
        m.setReceiver(receiverUser);
        m.setStudent(student);

        Message saved = messageRepository.save(m);
        return toDto(saved);
    }

    @Transactional
    public MessageDto sendFromParentToTeacher(Authentication authentication, CreateMessageRequestDto request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }
        String username = authentication.getName();
        User senderUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (senderUser.getRole() != Role.PARENT) {
            throw new RuntimeException("Only PARENT can send this message");
        }
        Parent parent = parentRepository.findByUserId(senderUser.getId())
                .orElseThrow(() -> new RuntimeException("Parent not found"));

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        if (student.getParent() == null || !student.getParent().getId().equals(parent.getId())) {
            throw new RuntimeException("Parent does not own this student");
        }

        if (student.getAClass() == null || student.getAClass().getTeacher() == null) {
            throw new RuntimeException("Student class has no teacher");
        }
        Teacher teacher = student.getAClass().getTeacher();
        User receiverUser = teacher.getUser();
        if (receiverUser == null) {
            throw new RuntimeException("Teacher has no user");
        }

        Message m = new Message();
        m.setText(request.getText());
        m.setSender(senderUser);
        m.setReceiver(receiverUser);
        m.setStudent(student);

        Message saved = messageRepository.save(m);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<MessageDto> getMessagesForCurrentParent(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() != Role.PARENT) {
            throw new RuntimeException("Only PARENT can view these messages");
        }

        return messageRepository.findByReceiver_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MessageDto> getMessagesForCurrentTeacher(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() != Role.TEACHER) {
            throw new RuntimeException("Only TEACHER can view these messages");
        }
        return messageRepository.findByReceiver_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteMessage(Authentication authentication, Long id) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }
        String username = authentication.getName();
        User current = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        boolean isOwner = (message.getSender() != null && message.getSender().getId().equals(current.getId()))
                || (message.getReceiver() != null && message.getReceiver().getId().equals(current.getId()));

        if (!isOwner && current.getRole() != Role.ADMIN) {
            throw new RuntimeException("Not allowed to delete this message");
        }

        messageRepository.delete(message);
    }

    private MessageDto toDto(Message m) {
        String senderName = m.getSender() != null ? m.getSender().getUsername() : "";
        String receiverName = m.getReceiver() != null ? m.getReceiver().getUsername() : "";
        Long studentId = m.getStudent() != null ? m.getStudent().getId() : null;
        String studentName = "";
        if (m.getStudent() != null) {
            String n = m.getStudent().getName() != null ? m.getStudent().getName() : "";
            String s = m.getStudent().getSurname() != null ? m.getStudent().getSurname() : "";
            studentName = (n + " " + s).trim();
        }
        return MessageDto.builder()
                .id(m.getId())
                .text(m.getText())
                .createdAt(m.getCreatedAt())
                .senderName(senderName)
                .receiverName(receiverName)
                .studentId(studentId)
                .studentName(studentName)
                .build();
    }
}

