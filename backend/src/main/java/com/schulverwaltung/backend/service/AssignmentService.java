package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.AddAssignmentRequestDto;
import com.schulverwaltung.backend.DTOs.AssignmentListDto;
import com.schulverwaltung.backend.DTOs.UpdateAssignmentRequestDto;
import com.schulverwaltung.backend.model.Assignment;
import com.schulverwaltung.backend.model.Lesson;
import com.schulverwaltung.backend.model.Student;
import com.schulverwaltung.backend.repository.AssignmentRepository;
import com.schulverwaltung.backend.repository.LessonRepository;
import com.schulverwaltung.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final LessonRepository lessonRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<AssignmentListDto> getAllAssignments() {
        return assignmentRepository.findAllWithLessonAndTeacher().stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AssignmentListDto> getAssignmentsByTeacherId(Long teacherId) {
        if (teacherId == null) {
            return List.of();
        }
        return assignmentRepository.findByLesson_Teacher_Id(teacherId).stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AssignmentListDto> getAssignmentsByStudentId(Long studentId) {
        try {
            if (studentId == null) {
                return List.of();
            }
            Student student = studentRepository.findByIdWithAClass(studentId).orElse(null);
            if (student == null || student.getAClass() == null) {
                return List.of();
            }
            Long classId = student.getAClass().getId();
            if (classId == null) {
                return List.of();
            }
            return assignmentRepository.findByLesson_AClass_IdWithDetails(classId).stream()
                    .map(this::toListDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return List.of();
        }
    }

    @Transactional
    public AssignmentListDto createAssignment(AddAssignmentRequestDto request) {
        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Assignment assignment = new Assignment();
        assignment.setTitle(request.getTitle());
        assignment.setStartTime(request.getStartTime());
        assignment.setEndTime(request.getEndTime());
        assignment.setLesson(lesson);

        Assignment saved = assignmentRepository.save(assignment);
        return toListDto(saved);
    }

    @Transactional
    public AssignmentListDto updateAssignment(Long id, UpdateAssignmentRequestDto request) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        assignment.setTitle(request.getTitle());
        assignment.setStartTime(request.getStartTime());
        assignment.setEndTime(request.getEndTime());
        assignment.setLesson(lesson);

        Assignment saved = assignmentRepository.save(assignment);
        return toListDto(saved);
    }

    @Transactional
    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }

    private AssignmentListDto toListDto(Assignment assignment) {
        String subjectName = assignment.getLesson() != null && assignment.getLesson().getSubject() != null
                ? assignment.getLesson().getSubject().getName()
                : "";
        String className = assignment.getLesson() != null && assignment.getLesson().getAClass() != null
                ? assignment.getLesson().getAClass().getName()
                : "";
        String teacherName = "";
        if (assignment.getLesson() != null && assignment.getLesson().getTeacher() != null) {
            var t = assignment.getLesson().getTeacher();
            teacherName = ((t.getName() != null ? t.getName() : "") + " " + (t.getSurname() != null ? t.getSurname() : "")).trim();
        }

        return AssignmentListDto.builder()
                .id(assignment.getId())
                .title(assignment.getTitle())
                .subjectName(subjectName)
                .className(className)
                .teacherName(teacherName)
                .startTime(assignment.getStartTime())
                .endTime(assignment.getEndTime())
                .lessonId(assignment.getLesson() != null ? assignment.getLesson().getId() : null)
                .build();
    }
}

