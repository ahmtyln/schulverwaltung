package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.AddExamRequestDto;
import com.schulverwaltung.backend.DTOs.ExamListDto;
import com.schulverwaltung.backend.DTOs.UpdateExamRequestDto;
import com.schulverwaltung.backend.model.Exam;
import com.schulverwaltung.backend.model.Lesson;
import com.schulverwaltung.backend.model.Student;
import com.schulverwaltung.backend.repository.ExamRepository;
import com.schulverwaltung.backend.repository.LessonRepository;
import com.schulverwaltung.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final LessonRepository lessonRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<ExamListDto> getAllExams() {
        return examRepository.findAll().stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExamListDto> getExamsByClassId(Long classId) {
        if (classId == null) {
            return List.of();
        }
        return examRepository.findAll().stream()
                .filter(e -> e.getLesson() != null && e.getLesson().getAClass() != null
                        && classId.equals(e.getLesson().getAClass().getId()))
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExamListDto> getExamsByTeacherId(Long teacherId) {
        if (teacherId == null) return List.of();
        return examRepository.findByLesson_Teacher_Id(teacherId).stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExamListDto> getExamsByStudentId(Long studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null || student.getAClass() == null || student.getAClass().getId() == null) {
            return List.of();
        }
        return getExamsByClassId(student.getAClass().getId());
    }

    @Transactional
    public ExamListDto createExam(AddExamRequestDto request) {
        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Exam exam = new Exam();
        exam.setTitle(request.getTitle());
        exam.setStartTime(request.getStartTime());
        exam.setEndTime(request.getEndTime());
        exam.setLesson(lesson);

        Exam saved = examRepository.save(exam);
        return toListDto(saved);
    }

    @Transactional
    public ExamListDto updateExam(Long id, UpdateExamRequestDto request) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        exam.setTitle(request.getTitle());
        exam.setStartTime(request.getStartTime());
        exam.setEndTime(request.getEndTime());
        exam.setLesson(lesson);

        Exam saved = examRepository.save(exam);
        return toListDto(saved);
    }

    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }

    private ExamListDto toListDto(Exam exam) {
        String subjectName = exam.getLesson() != null && exam.getLesson().getSubject() != null
                ? exam.getLesson().getSubject().getName()
                : "";
        String className = exam.getLesson() != null && exam.getLesson().getAClass() != null
                ? exam.getLesson().getAClass().getName()
                : "";
        String teacherName = exam.getLesson() != null && exam.getLesson().getTeacher() != null
                ? exam.getLesson().getTeacher().getName() + " " + exam.getLesson().getTeacher().getSurname()
                : "";

        return ExamListDto.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .subjectName(subjectName)
                .className(className)
                .teacherName(teacherName)
                .startTime(exam.getStartTime())
                .endTime(exam.getEndTime())
                .lessonId(exam.getLesson() != null ? exam.getLesson().getId() : null)
                .build();
    }
}

