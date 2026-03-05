package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.AddClassRequestDto;
import com.schulverwaltung.backend.DTOs.ClassListDto;
import com.schulverwaltung.backend.DTOs.UpdateClassRequestDto;
import com.schulverwaltung.backend.model.*;
import com.schulverwaltung.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassService {

    private final ClassRepository classRepository;
    private final GradeRepository gradeRepository;
    private final TeacherRepository teacherRepository;
    private final LessonRepository lessonRepository;
    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;
    private final AnnouncementRepository announcementRepository;

    @Transactional(readOnly = true)
    public List<ClassListDto> getAllClasses() {
        try {
            return classRepository.findAll().stream()
                    .map(this::toListDto)
                    .collect(Collectors.toList());
        } catch (InvalidDataAccessApiUsageException ex) {
            // Fallback: avoid propagating low-level binding error, return empty list
            return List.of();
        }
    }

    @Transactional(readOnly = true)
    public List<ClassListDto> getClassesByTeacherId(Long teacherId) {
        if (teacherId == null) return List.of();
        Teacher t = teacherRepository.findById(teacherId).orElse(null);
        if (t == null) return List.of();
        Set<Aclass> classes = new LinkedHashSet<>();
        for (Aclass c : t.getAclasses()) {
            if (c != null) classes.add(c);
        }
        for (Lesson l : t.getLessons()) {
            if (l.getAClass() != null) classes.add(l.getAClass());
        }
        return new ArrayList<>(classes).stream().map(this::toListDto).collect(Collectors.toList());
    }

    @Transactional
    public ClassListDto createClass(AddClassRequestDto request) {
        Grade grade = gradeRepository.findById(request.getGradeId())
                .orElseThrow(() -> new RuntimeException("Grade nicht gefunden."));
        Aclass aclass = new Aclass();
        aclass.setName(request.getName() != null ? request.getName().trim() : null);
        aclass.setCapacity(request.getCapacity());
        aclass.setGrade(grade);
        if (request.getTeacherId() != null && request.getTeacherId() > 0) {
            Teacher teacher = teacherRepository.findById(request.getTeacherId()).orElse(null);
            aclass.setTeacher(teacher);
        } else {
            aclass.setTeacher(null);
        }
        aclass = classRepository.save(aclass);
        return toListDto(aclass);
    }

    @Transactional
    public ClassListDto updateClass(Long id, UpdateClassRequestDto request) {
        Aclass aclass = classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class nicht gefunden."));
        if (request.getName() != null) {
            aclass.setName(request.getName().trim());
        }
        if (request.getCapacity() != null) {
            aclass.setCapacity(request.getCapacity());
        }
        if (request.getGradeId() != null && request.getGradeId() > 0) {
            Grade grade = gradeRepository.findById(request.getGradeId())
                    .orElseThrow(() -> new RuntimeException("Grade nicht gefunden."));
            aclass.setGrade(grade);
        }
        if (request.getTeacherId() != null && request.getTeacherId() > 0) {
            Teacher teacher = teacherRepository.findById(request.getTeacherId()).orElse(null);
            aclass.setTeacher(teacher);
        } else {
            aclass.setTeacher(null);
        }
        aclass = classRepository.save(aclass);
        return toListDto(aclass);
    }

    @Transactional
    public void deleteClass(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Class id is required");
        }
        Aclass aclass = classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class nicht gefunden."));
        List<Lesson> lessons = lessonRepository.findByAClass_Id(id);
        for (Lesson l : lessons) {
            l.setAClass(null);
        }
        lessonRepository.saveAll(lessons);
        List<Student> students = studentRepository.findByAClass_Id(id);
        for (Student s : students) {
            s.setAClass(null);
        }
        studentRepository.saveAll(students);
        List<Event> events = eventRepository.findByClassId(id);
        for (Event e : events) {
            e.setAClass(null);
        }
        eventRepository.saveAll(events);
        List<Announcement> announcements = announcementRepository.findByClassId(id);
        for (Announcement a : announcements) {
            a.setAClass(null);
        }
        announcementRepository.saveAll(announcements);
        classRepository.delete(aclass);
    }

    private ClassListDto toListDto(Aclass c) {
        Grade g = c.getGrade();
        Integer gradeLevel = g != null ? g.getLevel() : null;
        Long gradeId = g != null ? g.getId() : null;
        Teacher t = c.getTeacher();
        String supervisorName = t != null ? (t.getName() + " " + (t.getSurname() != null ? t.getSurname() : "")).trim() : "";
        Long teacherId = t != null ? t.getId() : null;
        return ClassListDto.builder()
                .id(c.getId())
                .name(c.getName())
                .capacity(c.getCapacity())
                .gradeLevel(gradeLevel)
                .gradeId(gradeId)
                .supervisorName(supervisorName)
                .teacherId(teacherId)
                .build();
    }
}
