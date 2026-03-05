package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.AddEventRequestDto;
import com.schulverwaltung.backend.DTOs.EventListDto;
import com.schulverwaltung.backend.DTOs.UpdateEventRequestDto;
import com.schulverwaltung.backend.model.Aclass;
import com.schulverwaltung.backend.model.Event;
import com.schulverwaltung.backend.model.Lesson;
import com.schulverwaltung.backend.model.Student;
import com.schulverwaltung.backend.model.Teacher;
import com.schulverwaltung.backend.repository.ClassRepository;
import com.schulverwaltung.backend.repository.EventRepository;
import com.schulverwaltung.backend.repository.StudentRepository;
import com.schulverwaltung.backend.repository.TeacherRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;
    private final ClassRepository classRepository;
    private final TeacherRepository teacherRepository;

    @Transactional(readOnly = true)
    public List<EventListDto> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventListDto> getEventsByClassId(Long classId) {
        if (classId == null) {
            return List.of();
        }
        return eventRepository.findByClassId(classId).stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventListDto> getEventsByTeacherId(Long teacherId) {
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
        List<EventListDto> result = new ArrayList<>();
        for (Long cid : classIds) {
            result.addAll(getEventsByClassId(cid));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<EventListDto> getEventsByStudentId(Long studentId) {
        try {
            if (studentId == null) {
                return List.of();
            }
            Student student = studentRepository.findByIdWithAClass(studentId).orElse(null);
            if (student == null || student.getAClass() == null || student.getAClass().getId() == null) {
                return List.of();
            }
            return getEventsByClassId(student.getAClass().getId());
        } catch (Exception e) {
            return List.of();
        }
    }

    @Transactional
    public EventListDto createEvent(AddEventRequestDto request) {
        Aclass aClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDate(request.getDate());
        event.setPrice(request.getPrice());
        event.setAClass(aClass);
        Event saved = eventRepository.save(event);
        return toListDto(saved);
    }

    @Transactional
    public EventListDto updateEvent(Long id, UpdateEventRequestDto request) {
        if (!id.equals(request.getId())) {
            throw new RuntimeException("Path ID and body ID must match");
        }
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        if (request.getTitle() != null) event.setTitle(request.getTitle());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        if (request.getDate() != null) event.setDate(request.getDate());
        if (request.getPrice() != null) event.setPrice(request.getPrice());
        if (request.getClassId() != null) {
            Aclass aClass = classRepository.findById(request.getClassId())
                    .orElseThrow(() -> new RuntimeException("Class not found"));
            event.setAClass(aClass);
        }
        Event saved = eventRepository.save(event);
        return toListDto(saved);
    }

    @Transactional
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    private EventListDto toListDto(Event event) {
        String className = event.getAClass() != null ? event.getAClass().getName() : "";
        Long classId = event.getAClass() != null ? event.getAClass().getId() : null;
        return EventListDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .date(event.getDate())
                .className(className)
                .classId(classId)
                .price(event.getPrice())
                .build();
    }
}
