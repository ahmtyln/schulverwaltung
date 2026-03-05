package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.ParentListDto;
import com.schulverwaltung.backend.DTOs.RegisterRequestDto;
import com.schulverwaltung.backend.DTOs.RegisterResponseDto;
import com.schulverwaltung.backend.enums.Role;
import com.schulverwaltung.backend.exceptions.EmailAlreadyExistsException;
import com.schulverwaltung.backend.exceptions.UsernameAlreadyExistsException;
import com.schulverwaltung.backend.model.Aclass;
import com.schulverwaltung.backend.model.Lesson;
import com.schulverwaltung.backend.model.Parent;
import com.schulverwaltung.backend.model.Student;
import com.schulverwaltung.backend.model.Teacher;
import com.schulverwaltung.backend.model.User;
import com.schulverwaltung.backend.repository.ParentRepository;
import com.schulverwaltung.backend.repository.StudentRepository;
import com.schulverwaltung.backend.repository.TeacherRepository;
import com.schulverwaltung.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParentService {
    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
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

    @Transactional(readOnly = true)
    public List<ParentListDto> getAllParents() {
        return parentRepository.findAll().stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ParentListDto> getParentsByTeacherId(Long teacherId) {
        if (teacherId == null) return List.of();
        Teacher t = teacherRepository.findById(teacherId).orElse(null);
        if (t == null) return List.of();
        Set<Long> classIds = new HashSet<>();
        for (Lesson l : t.getLessons()) {
            if (l.getAClass() != null && l.getAClass().getId() != null) classIds.add(l.getAClass().getId());
        }
        for (Aclass c : t.getAclasses()) {
            if (c.getId() != null) classIds.add(c.getId());
        }
        if (classIds.isEmpty()) return List.of();
        List<Student> students = studentRepository.findByAClass_IdIn(new ArrayList<>(classIds));
        Set<Long> parentIds = new HashSet<>();
        for (Student s : students) {
            if (s.getParent() != null && s.getParent().getId() != null) parentIds.add(s.getParent().getId());
        }
        if (parentIds.isEmpty()) return List.of();
        List<Parent> parents = parentRepository.findAllById(parentIds);
        return parents.stream().map(this::toListDto).collect(Collectors.toList());
    }

    private ParentListDto toListDto(Parent p) {
        String email = p.getUser() != null ? p.getUser().getEmail() : "";
        List<String> studentNames = p.getStudents() != null
                ? p.getStudents().stream()
                .map(s -> (s.getName() + " " + (s.getSurname() != null ? s.getSurname() : "")).trim())
                .collect(Collectors.toList())
                : List.of();
        List<Long> studentIds = p.getStudents() != null
                ? p.getStudents().stream().map(Student::getId).collect(Collectors.toList())
                : List.of();
        return ParentListDto.builder()
                .id(p.getId())
                .name(p.getName())
                .surname(p.getSurname())
                .email(email)
                .phone(p.getPhone())
                .address(p.getAddress())
                .studentNames(studentNames)
                .studentIds(studentIds)
                .build();
    }
}
