package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.MeDto;
import com.schulverwaltung.backend.DTOs.MeStudentSummaryDto;
import com.schulverwaltung.backend.enums.Role;
import com.schulverwaltung.backend.model.Admin;
import com.schulverwaltung.backend.model.Parent;
import com.schulverwaltung.backend.model.Student;
import com.schulverwaltung.backend.model.Aclass;
import com.schulverwaltung.backend.model.Lesson;
import com.schulverwaltung.backend.model.Teacher;
import com.schulverwaltung.backend.model.User;
import com.schulverwaltung.backend.repository.AdminRepository;
import com.schulverwaltung.backend.repository.ParentRepository;
import com.schulverwaltung.backend.repository.StudentRepository;
import com.schulverwaltung.backend.repository.TeacherRepository;
import com.schulverwaltung.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MeService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final AdminRepository adminRepository;

    @Transactional(readOnly = true)
    public MeDto getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return MeDto.builder().build();
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return MeDto.builder().build();
        }

        Role role = user.getRole();
        if (role == null) {
            return MeDto.builder().role(role).build();
        }

        return switch (role) {
            case STUDENT -> {
                Student s = studentRepository.findByUserId(user.getId()).orElse(null);
                Long classId = (s != null && s.getAClass() != null) ? s.getAClass().getId() : null;
                List<MeStudentSummaryDto>                 studentSummaries = s != null
                        ? List.of(MeStudentSummaryDto.builder()
                        .id(s.getId())
                        .fullName(((s.getName() != null ? s.getName() : "") + " " + (s.getSurname() != null ? s.getSurname() : "")).trim())
                        .classId(classId)
                        .build())
                        : Collections.emptyList();
                yield MeDto.builder()
                        .role(Role.STUDENT)
                        .studentId(s != null ? s.getId() : null)
                        .studentIds(s != null ? List.of(s.getId()) : Collections.emptyList())
                        .studentSummaries(studentSummaries)
                        .classId(classId)
                        .build();
            }
            case TEACHER -> {
                Teacher t = teacherRepository.findByUserId(user.getId()).orElse(null);
                List<Long> classIds = new ArrayList<>();
                if (t != null) {
                    Set<Long> ids = new HashSet<>();
                    for (Lesson l : t.getLessons()) {
                        if (l.getAClass() != null && l.getAClass().getId() != null) ids.add(l.getAClass().getId());
                    }
                    for (Aclass c : t.getAclasses()) {
                        if (c.getId() != null) ids.add(c.getId());
                    }
                    classIds = new ArrayList<>(ids);
                }
                yield MeDto.builder()
                        .role(Role.TEACHER)
                        .teacherId(t != null ? t.getId() : null)
                        .classIds(classIds)
                        .build();
            }
            case PARENT -> {
                Parent p = parentRepository.findByUserId(user.getId()).orElse(null);
                List<Long> studentIds = Collections.emptyList();
                List<MeStudentSummaryDto> studentSummaries = Collections.emptyList();
                if (p != null) {
                    List<Student> children = studentRepository.findByParent_IdWithAClass(p.getId());
                    studentIds = children.stream().map(Student::getId).collect(Collectors.toList());
                    studentSummaries = children.stream()
                            .map(s -> MeStudentSummaryDto.builder()
                                    .id(s.getId())
                                    .fullName(((s.getName() != null ? s.getName() : "") + " " + (s.getSurname() != null ? s.getSurname() : "")).trim())
                                    .classId(s.getAClass() != null ? s.getAClass().getId() : null)
                                    .build())
                            .collect(Collectors.toList());
                }
                yield MeDto.builder()
                        .role(Role.PARENT)
                        .parentId(p != null ? p.getId() : null)
                        .studentIds(studentIds)
                        .studentSummaries(studentSummaries)
                        .build();
            }
            case ADMIN -> {
                Admin a = adminRepository.findByUserId(user.getId()).orElse(null);
                yield MeDto.builder()
                        .role(Role.ADMIN)
                        .adminId(a != null ? a.getId() : null)
                        .build();
            }
        };
    }
}
