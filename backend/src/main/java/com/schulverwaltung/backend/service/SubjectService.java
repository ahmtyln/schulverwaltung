package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.AddSubjectRequestDto;
import com.schulverwaltung.backend.DTOs.SubjectListDto;
import com.schulverwaltung.backend.DTOs.UpdateSubjectRequestDto;
import com.schulverwaltung.backend.model.Lesson;
import com.schulverwaltung.backend.model.Subject;
import com.schulverwaltung.backend.model.Teacher;
import com.schulverwaltung.backend.repository.LessonRepository;
import com.schulverwaltung.backend.repository.SubjectRepository;
import com.schulverwaltung.backend.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final LessonRepository lessonRepository;

    @Transactional(readOnly = true)
    public List<SubjectListDto> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubjectListDto createSubject(AddSubjectRequestDto request) {
        Subject subject = new Subject();
        subject.setName(request.getName().trim());
        if (request.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(request.getTeacherId())
                    .orElse(null);
            subject.setTeacher(teacher);
        }
        subject = subjectRepository.save(subject);
        return toListDto(subject);
    }

    @Transactional
    public SubjectListDto updateSubject(Long id, UpdateSubjectRequestDto request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject nicht gefunden."));
        if (request.getName() != null && !request.getName().isBlank()) {
            subject.setName(request.getName().trim());
        }
        if (request.getTeacherId() != null && request.getTeacherId() > 0) {
            Teacher teacher = teacherRepository.findById(request.getTeacherId())
                    .orElse(null);
            subject.setTeacher(teacher);
        } else {
            subject.setTeacher(null);
        }
        subject = subjectRepository.save(subject);
        return toListDto(subject);
    }

    @Transactional
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject nicht gefunden."));
        List<Lesson> lessons = lessonRepository.findBySubject_Id(id);
        for (Lesson l : lessons) {
            l.setSubject(null);
        }
        lessonRepository.saveAll(lessons);
        subjectRepository.delete(subject);
    }

    private SubjectListDto toListDto(Subject s) {
        Teacher t = s.getTeacher();
        String teacherName = t != null ? (t.getName() + " " + (t.getSurname() != null ? t.getSurname() : "")).trim() : "";
        Long teacherId = t != null ? t.getId() : null;
        return SubjectListDto.builder()
                .id(s.getId())
                .name(s.getName())
                .teacherName(teacherName)
                .teacherId(teacherId)
                .build();
    }
}
