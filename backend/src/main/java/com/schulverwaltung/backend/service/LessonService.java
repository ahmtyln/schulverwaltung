package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.AddLessonRequestDto;
import com.schulverwaltung.backend.DTOs.LessonListDto;
import com.schulverwaltung.backend.DTOs.UpdateLessonRequestDto;
import com.schulverwaltung.backend.enums.Day;
import com.schulverwaltung.backend.model.*;
import com.schulverwaltung.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final SubjectRepository subjectRepository;
    private final ClassRepository classRepository;
    private final TeacherRepository teacherRepository;
    private final ExamRepository examRepository;
    private final AssignmentRepository assignmentRepository;
    private final AttendanceRepository attendanceRepository;

    @Transactional(readOnly = true)
    public List<LessonListDto> getAllLessons() {
        return lessonRepository.findAll().stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LessonListDto> getLessonsByTeacherId(Long teacherId) {
        if (teacherId == null) return List.of();
        return lessonRepository.findByTeacher_Id(teacherId).stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LessonListDto createLesson(AddLessonRequestDto request) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        Aclass aClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        Lesson lesson = new Lesson();
        lesson.setName(request.getName());
        lesson.setStartTime(request.getStartTime());
        lesson.setEndTime(request.getEndTime());
        lesson.setSubject(subject);
        lesson.setAClass(aClass);
        lesson.setTeacher(teacher);
        if (request.getDay() != null && !request.getDay().isBlank()) {
            try {
                lesson.setDay(Day.valueOf(request.getDay().toUpperCase().trim()));
            } catch (IllegalArgumentException ignored) {}
        }
        Lesson saved = lessonRepository.save(lesson);
        return toListDto(saved);
    }

    @Transactional
    public LessonListDto updateLesson(Long id, UpdateLessonRequestDto request) {
        if (!id.equals(request.getId())) {
            throw new RuntimeException("Path ID and body ID must match");
        }
        Lesson lesson = lessonRepository.findById(id).orElseThrow(() -> new RuntimeException("Lesson not found"));
        if (request.getName() != null) lesson.setName(request.getName());
        if (request.getStartTime() != null) lesson.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) lesson.setEndTime(request.getEndTime());
        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));
            lesson.setSubject(subject);
        }
        if (request.getClassId() != null) {
            Aclass aClass = classRepository.findById(request.getClassId())
                    .orElseThrow(() -> new RuntimeException("Class not found"));
            lesson.setAClass(aClass);
        }
        if (request.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));
            lesson.setTeacher(teacher);
        }
        if (request.getDay() != null && !request.getDay().isBlank()) {
            try {
                lesson.setDay(Day.valueOf(request.getDay().toUpperCase().trim()));
            } catch (IllegalArgumentException ignored) {}
        }
        Lesson saved = lessonRepository.save(lesson);
        return toListDto(saved);
    }

    @Transactional
    public void deleteLesson(Long id) {
        Lesson lesson = lessonRepository.findById(id).orElseThrow(() -> new RuntimeException("Lesson not found"));
        attendanceRepository.findByLesson_Id(id).forEach(attendanceRepository::delete);
        examRepository.findByLesson_Id(id).forEach(e -> { e.setLesson(null); examRepository.save(e); });
        assignmentRepository.findByLesson_Id(id).forEach(a -> { a.setLesson(null); assignmentRepository.save(a); });
        lessonRepository.delete(lesson);
    }

    private LessonListDto toListDto(Lesson lesson) {
        String subjectName = lesson.getSubject() != null ? lesson.getSubject().getName() : "";
        String className = lesson.getAClass() != null ? lesson.getAClass().getName() : "";
        String teacherName = lesson.getTeacher() != null
                ? (lesson.getTeacher().getName() + " " + (lesson.getTeacher().getSurname() != null ? lesson.getTeacher().getSurname() : "")).trim()
                : "";
        Long subjectId = lesson.getSubject() != null ? lesson.getSubject().getId() : null;
        Long classId = lesson.getAClass() != null ? lesson.getAClass().getId() : null;
        Long teacherId = lesson.getTeacher() != null ? lesson.getTeacher().getId() : null;
        String dayStr = lesson.getDay() != null ? lesson.getDay().name() : null;
        return LessonListDto.builder()
                .id(lesson.getId())
                .name(lesson.getName())
                .subjectName(subjectName)
                .className(className)
                .teacherName(teacherName)
                .day(dayStr)
                .startTime(lesson.getStartTime())
                .endTime(lesson.getEndTime())
                .subjectId(subjectId)
                .classId(classId)
                .teacherId(teacherId)
                .build();
    }
}
