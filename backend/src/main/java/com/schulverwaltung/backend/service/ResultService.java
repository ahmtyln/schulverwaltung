package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.AddResultRequestDto;
import com.schulverwaltung.backend.DTOs.ResultListDto;
import com.schulverwaltung.backend.DTOs.UpdateResultRequestDto;
import com.schulverwaltung.backend.model.Assignment;
import com.schulverwaltung.backend.model.Exam;
import com.schulverwaltung.backend.model.Result;
import com.schulverwaltung.backend.model.Student;
import com.schulverwaltung.backend.repository.AssignmentRepository;
import com.schulverwaltung.backend.repository.ExamRepository;
import com.schulverwaltung.backend.repository.ResultRepository;
import com.schulverwaltung.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final ExamRepository examRepository;
    private final AssignmentRepository assignmentRepository;

    @Transactional(readOnly = true)
    public List<ResultListDto> getAllResults() {
        return resultRepository.findAll().stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ResultListDto> getResultsByStudentId(Long studentId) {
        return resultRepository.findAll().stream()
                .filter(r -> r.getStudent() != null && r.getStudent().getId().equals(studentId))
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ResultListDto> getResultsByTeacherId(Long teacherId) {
        if (teacherId == null) {
            return List.of();
        }
        return resultRepository.findAll().stream()
                .filter(r -> {
                    // Results coming from exams
                    if (r.getExam() != null
                            && r.getExam().getLesson() != null
                            && r.getExam().getLesson().getTeacher() != null
                            && r.getExam().getLesson().getTeacher().getId() != null
                            && r.getExam().getLesson().getTeacher().getId().equals(teacherId)) {
                        return true;
                    }
                    // Results coming from assignments
                    if (r.getAssignment() != null
                            && r.getAssignment().getLesson() != null
                            && r.getAssignment().getLesson().getTeacher() != null
                            && r.getAssignment().getLesson().getTeacher().getId() != null
                            && r.getAssignment().getLesson().getTeacher().getId().equals(teacherId)) {
                        return true;
                    }
                    return false;
                })
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ResultListDto createResult(AddResultRequestDto request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Result result = new Result();
        result.setScore(request.getScore());
        result.setStudent(student);

        LocalDateTime date = LocalDateTime.now();

        if (request.getExamId() != null) {
            Exam exam = examRepository.findById(request.getExamId())
                    .orElseThrow(() -> new RuntimeException("Exam not found"));
            result.setExam(exam);
            if (exam.getStartTime() != null) {
                date = exam.getStartTime();
            }
        } else if (request.getAssignmentId() != null) {
            Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                    .orElseThrow(() -> new RuntimeException("Assignment not found"));
            result.setAssignment(assignment);
            if (assignment.getEndTime() != null) {
                date = assignment.getEndTime();
            }
        }

        Result saved = resultRepository.save(result);
        ResultListDto dto = toListDto(saved);
        dto.setDate(date);
        return dto;
    }

    @Transactional
    public void deleteResult(Long id) {
        resultRepository.deleteById(id);
    }

    @Transactional
    public ResultListDto updateResult(Long id, UpdateResultRequestDto request) {
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Result not found"));
        if (request.getScore() != null) {
            result.setScore(request.getScore());
        }
        Result saved = resultRepository.save(result);
        return toListDto(saved);
    }

    private ResultListDto toListDto(Result result) {
        String title = "";
        String subjectName = "";
        String className = "";
        String teacherName = "";
        LocalDateTime date = null;
        String type = "";

        if (result.getExam() != null) {
            Exam exam = result.getExam();
            type = "EXAM";
            title = exam.getTitle();
            if (exam.getLesson() != null) {
                if (exam.getLesson().getSubject() != null) {
                    subjectName = exam.getLesson().getSubject().getName();
                }
                if (exam.getLesson().getAClass() != null) {
                    className = exam.getLesson().getAClass().getName();
                }
                if (exam.getLesson().getTeacher() != null) {
                    teacherName = exam.getLesson().getTeacher().getName() + " " +
                            exam.getLesson().getTeacher().getSurname();
                }
            }
            date = exam.getStartTime();
        } else if (result.getAssignment() != null) {
            Assignment assignment = result.getAssignment();
            type = "ASSIGNMENT";
            title = assignment.getTitle();
            if (assignment.getLesson() != null) {
                if (assignment.getLesson().getSubject() != null) {
                    subjectName = assignment.getLesson().getSubject().getName();
                }
                if (assignment.getLesson().getAClass() != null) {
                    className = assignment.getLesson().getAClass().getName();
                }
                if (assignment.getLesson().getTeacher() != null) {
                    teacherName = assignment.getLesson().getTeacher().getName() + " " +
                            assignment.getLesson().getTeacher().getSurname();
                }
            }
            date = assignment.getEndTime();
        }

        String studentName = result.getStudent() != null
                ? result.getStudent().getName() + " " + result.getStudent().getSurname()
                : "";

        Long examId = result.getExam() != null ? result.getExam().getId() : null;
        Long assignmentId = result.getAssignment() != null ? result.getAssignment().getId() : null;
        Long studentId = result.getStudent() != null ? result.getStudent().getId() : null;

        return ResultListDto.builder()
                .id(result.getId())
                .title(title)
                .subjectName(subjectName)
                .className(className)
                .studentName(studentName)
                .teacherName(teacherName)
                .score(result.getScore())
                .date(date)
                .type(type)
                .studentId(studentId)
                .examId(examId)
                .assignmentId(assignmentId)
                .build();
    }
}

