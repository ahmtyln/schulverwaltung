package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.AddAnnouncementRequestDto;
import com.schulverwaltung.backend.DTOs.AnnouncementListDto;
import com.schulverwaltung.backend.DTOs.UpdateAnnouncementRequestDto;
import com.schulverwaltung.backend.model.Aclass;
import com.schulverwaltung.backend.model.Announcement;
import com.schulverwaltung.backend.model.Lesson;
import com.schulverwaltung.backend.model.Student;
import com.schulverwaltung.backend.model.Teacher;
import com.schulverwaltung.backend.repository.AnnouncementRepository;
import com.schulverwaltung.backend.repository.ClassRepository;
import com.schulverwaltung.backend.repository.StudentRepository;
import com.schulverwaltung.backend.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final StudentRepository studentRepository;
    private final ClassRepository classRepository;
    private final TeacherRepository teacherRepository;

    @Transactional(readOnly = true)
    public List<AnnouncementListDto> getAllAnnouncements() {
        return announcementRepository.findAll().stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AnnouncementListDto> getAnnouncementsByClassId(Long classId) {
        if (classId == null) {
            return List.of();
        }
        return announcementRepository.findByClassId(classId).stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AnnouncementListDto> getAnnouncementsByTeacherId(Long teacherId) {
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
        List<AnnouncementListDto> result = new ArrayList<>();
        for (Long cid : classIds) {
            result.addAll(getAnnouncementsByClassId(cid));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<AnnouncementListDto> getAnnouncementsByStudentId(Long studentId) {
        try {
            if (studentId == null) {
                return List.of();
            }
            Student student = studentRepository.findByIdWithAClass(studentId).orElse(null);
            if (student == null || student.getAClass() == null || student.getAClass().getId() == null) {
                return List.of();
            }
            return getAnnouncementsByClassId(student.getAClass().getId());
        } catch (Exception e) {
            return List.of();
        }
    }

    @Transactional
    public AnnouncementListDto createAnnouncement(AddAnnouncementRequestDto request) {
        Aclass aClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
        Announcement a = new Announcement();
        a.setTitle(request.getTitle());
        a.setDescription(request.getDescription());
        a.setDate(request.getDate());
        a.setAClass(aClass);
        Announcement saved = announcementRepository.save(a);
        return toListDto(saved);
    }

    @Transactional
    public AnnouncementListDto updateAnnouncement(Long id, UpdateAnnouncementRequestDto request) {
        if (!id.equals(request.getId())) {
            throw new RuntimeException("Path ID and body ID must match");
        }
        Announcement a = announcementRepository.findById(id).orElseThrow(() -> new RuntimeException("Announcement not found"));
        if (request.getTitle() != null) a.setTitle(request.getTitle());
        if (request.getDescription() != null) a.setDescription(request.getDescription());
        if (request.getDate() != null) a.setDate(request.getDate());
        if (request.getClassId() != null) {
            Aclass aClass = classRepository.findById(request.getClassId())
                    .orElseThrow(() -> new RuntimeException("Class not found"));
            a.setAClass(aClass);
        }
        Announcement saved = announcementRepository.save(a);
        return toListDto(saved);
    }

    @Transactional
    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }

    private AnnouncementListDto toListDto(Announcement a) {
        String className = a.getAClass() != null ? a.getAClass().getName() : "";
        Long classId = a.getAClass() != null ? a.getAClass().getId() : null;
        return AnnouncementListDto.builder()
                .id(a.getId())
                .title(a.getTitle())
                .description(a.getDescription())
                .date(a.getDate())
                .className(className)
                .classId(classId)
                .build();
    }
}
