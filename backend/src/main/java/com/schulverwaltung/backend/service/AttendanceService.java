package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.AddAttendanceRequestDto;
import com.schulverwaltung.backend.DTOs.AttendanceListDto;
import com.schulverwaltung.backend.model.Attendance;
import com.schulverwaltung.backend.model.Lesson;
import com.schulverwaltung.backend.model.Student;
import com.schulverwaltung.backend.repository.AttendanceRepository;
import com.schulverwaltung.backend.repository.LessonRepository;
import com.schulverwaltung.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final LessonRepository lessonRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<AttendanceListDto> getAllAttendances() {
        return attendanceRepository.findAll().stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AttendanceListDto> getAttendancesByStudentId(Long studentId) {
        return attendanceRepository.findByStudent_Id(studentId).stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AttendanceListDto> getAttendancesByTeacherId(Long teacherId) {
        if (teacherId == null) {
            return List.of();
        }
        return attendanceRepository.findByLesson_Teacher_Id(teacherId).stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    /** Create attendance records for absent students only (present = false). */
    @Transactional
    public List<AttendanceListDto> createAbsent(AddAttendanceRequestDto request) {
        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        if (request.getStudentIds() == null || request.getStudentIds().isEmpty()) {
            return List.of();
        }
        List<Student> students = studentRepository.findAllById(request.getStudentIds());
        List<Attendance> saved = new ArrayList<>();
        for (Student student : students) {
            Attendance att = new Attendance();
            att.setDate(request.getDate());
            att.setPresent(false);
            att.setStudent(student);
            att.setLesson(lesson);
            saved.add(attendanceRepository.save(att));
        }
        return saved.stream().map(this::toListDto).collect(Collectors.toList());
    }

    private AttendanceListDto toListDto(Attendance a) {
        Student s = a.getStudent();
        String studentName = s != null ? (s.getName() + " " + (s.getSurname() != null ? s.getSurname() : "")).trim() : "";
        Lesson lesson = a.getLesson();
        String lessonName = lesson != null ? (lesson.getName() != null ? lesson.getName() : "") : "";
        return AttendanceListDto.builder()
                .id(a.getId())
                .studentId(s != null ? s.getId() : null)
                .date(a.getDate())
                .present(a.isPresent())
                .studentName(studentName)
                .lessonName(lessonName)
                .build();
    }
}
