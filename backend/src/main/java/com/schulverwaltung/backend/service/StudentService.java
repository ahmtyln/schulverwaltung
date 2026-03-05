package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.*;
import com.schulverwaltung.backend.enums.Role;
import com.schulverwaltung.backend.exceptions.EmailAlreadyExistsException;
import com.schulverwaltung.backend.exceptions.UsernameAlreadyExistsException;
import com.schulverwaltung.backend.mapper.LessonMapper;
import com.schulverwaltung.backend.mapper.StudentListMapper;
import com.schulverwaltung.backend.model.Aclass;
import com.schulverwaltung.backend.model.Lesson;
import com.schulverwaltung.backend.model.Parent;
import com.schulverwaltung.backend.model.Student;
import com.schulverwaltung.backend.model.Teacher;
import com.schulverwaltung.backend.model.User;
import com.schulverwaltung.backend.repository.AttendanceRepository;
import com.schulverwaltung.backend.repository.ClassRepository;
import com.schulverwaltung.backend.repository.LessonRepository;
import com.schulverwaltung.backend.repository.ParentRepository;
import com.schulverwaltung.backend.repository.ResultRepository;
import com.schulverwaltung.backend.repository.StudentRepository;
import com.schulverwaltung.backend.repository.TeacherRepository;
import com.schulverwaltung.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final ResultRepository resultRepository;
    private final PasswordEncoder passwordEncoder;
    private final ClassRepository classRepository;
    private final ParentRepository parentRepository;
    private final TeacherRepository teacherRepository;
    private final StudentListMapper studentMapper;
    private final LessonMapper lessonMapper;

    public RegisterResponseDto register(RegisterRequestDto request){

        if(userRepository.existsByUsername(request.getUsername())){
            throw new UsernameAlreadyExistsException("Username existiert bereits.");
        }
        if(userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistsException("Email existiert bereits.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT);


        Student student = new Student();
        student.setName(request.getName());
        student.setSurname(request.getSurname());
        student.setUser(user);

        studentRepository.save(student);

        RegisterResponseDto response = new RegisterResponseDto();
        response.setName(student.getName());
        response.setSurname(student.getSurname());
        response.setEmail(student.getUser().getEmail());

        return response;
    }

    public RegisterResponseDto profileStudent(Authentication authentication){
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Benutzer ist nicht gefunden."));

        Student student = studentRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Student ist nicht gefunden."));

        RegisterResponseDto response = new RegisterResponseDto();

        response.setEmail(student.getUser().getEmail());
        response.setSurname(student.getSurname());
        response.setName(student.getName());

        return response;
    }

    @Transactional(readOnly = true)
    public List<StudentListDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(studentMapper::toStudentListDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentListDto> getStudentsByTeacherId(Long teacherId) {
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
        if (classIds.isEmpty()) return List.of();
        List<Student> students = studentRepository.findByAClass_IdIn(new ArrayList<>(classIds));
        return students.stream().map(studentMapper::toStudentListDto).collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public StudentDetailDto getOneStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return StudentDetailDto.builder()
                .id(student.getId())
                .fullName(student.getName() + " " + student.getSurname())
                .studentId("S" + String.format("%03d", student.getId()))
                .email(student.getUser().getEmail())
                .phone(student.getPhone())
                .address(student.getAddress())
                .className(student.getAClass() != null ? student.getAClass().getName() : "10A")  // ← NULL SAFE!
                .gradeLevel(student.getGrade() != null ? student.getGrade().getLevel() : 1)      // ← NULL SAFE!
                .bloodType(student.getBloodType())
                .build();
    }

    @Transactional
    public StudentResponseDto createStudent(AddStudentRequestDto request) {
        if (request.getPhone() != null && !request.getPhone().isBlank()
                && studentRepository.existsByPhone(request.getPhone().trim())) {
            throw new RuntimeException("Phone number already in use. Please use a different number.");
        }
        // User
        User user = User.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .build();

        // Class (required)
        if (request.getClassName() == null || request.getClassName().isBlank()) {
            throw new RuntimeException("Class name is required. Please select a class from the list.");
        }
        Aclass studentClass = classRepository.findByName(request.getClassName().trim())
                .orElseThrow(() -> new RuntimeException("Class '" + request.getClassName() + "' not found. Create the class first under Classes."));

        // Student
        Student student = Student.builder()
                .name(request.getName())
                .surname(request.getSurname())
                .phone(request.getPhone())
                .address(request.getAddress())
                .bloodType(request.getBloodType())
                .aClass(studentClass)
                .user(user)
                .build();
        if (studentClass.getGrade() != null) {
            student.setGrade(studentClass.getGrade());
        }

        // Parent optional
        Parent parentForDto = null;
        if (request.getParentId() != null) {
            Parent parent = parentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent not found"));
            student.setParent(parent);
            parentForDto = parent;
        }

        Student saved = studentRepository.save(student);
        return buildResponseDto(saved, user.getEmail(), studentClass.getName(),
                studentClass.getGrade() != null ? studentClass.getGrade().getLevel() : 0,
                saved.getCreatedAt(), parentForDto);
    }

    /** Build response DTO without touching lazy proxies on the saved entity. */
    private StudentResponseDto buildResponseDto(Student saved, String email, String className,
                                                 int gradeLevel, java.time.LocalDateTime createdAt, Parent parentForDto) {
        ParentSummaryDto parentDto = parentForDto != null
                ? ParentSummaryDto.builder()
                .id(parentForDto.getId())
                .fullName(parentForDto.getName() + " " + (parentForDto.getSurname() != null ? parentForDto.getSurname() : ""))
                .phone(parentForDto.getPhone())
                .build()
                : null;
        return StudentResponseDto.builder()
                .id(saved.getId())
                .fullName(saved.getName() + " " + (saved.getSurname() != null ? saved.getSurname() : ""))
                .email(email)
                .phone(saved.getPhone())
                .address(saved.getAddress())
                .bloodType(saved.getBloodType())
                .className(className)
                .gradeLevel(gradeLevel)
                .createdAt(createdAt)
                .parent(parentDto)
                .build();
    }

    @Transactional
    public StudentResponseDto updateStudent(Long id, AddStudentRequestDto request) {
        if (request.getPhone() != null && !request.getPhone().isBlank()
                && studentRepository.existsByPhoneAndIdNot(request.getPhone().trim(), id)) {
            throw new RuntimeException("Phone number already in use by another student.");
        }
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setName(request.getName());
        student.setSurname(request.getSurname());
        student.setPhone(request.getPhone());
        student.setAddress(request.getAddress());
        student.setBloodType(request.getBloodType());

        Aclass dtoClass = null;
        if (request.getClassName() != null && !request.getClassName().isBlank()) {
            Aclass studentClass = classRepository.findByName(request.getClassName().trim())
                    .orElseThrow(() -> new RuntimeException("Class '" + request.getClassName() + "' not found."));
            student.setAClass(studentClass);
            dtoClass = studentClass;
            if (studentClass.getGrade() != null) {
                student.setGrade(studentClass.getGrade());
            }
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            student.getUser().setPassword(passwordEncoder.encode(request.getPassword()));
        }

        Parent parentForDto = null;
        if (request.getParentId() != null) {
            Parent parent = parentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent not found"));
            student.setParent(parent);
            parentForDto = parent;
        } else {
            student.setParent(null);
        }

        Student saved = studentRepository.save(student);

        String email = "";
        if (saved.getUser() != null) {
            email = userRepository.findById(saved.getUser().getId()).map(User::getEmail).orElse("");
        }
        if (dtoClass == null && saved.getAClass() != null) {
            dtoClass = classRepository.findById(saved.getAClass().getId()).orElse(null);
        }
        String className = dtoClass != null ? dtoClass.getName() : "";
        int gradeLevel = dtoClass != null && dtoClass.getGrade() != null ? dtoClass.getGrade().getLevel() : 0;
        return buildResponseDto(saved, email, className, gradeLevel, saved.getCreatedAt(), parentForDto);
    }

    @Transactional
    public void deleteById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        attendanceRepository.deleteAll(attendanceRepository.findByStudent_Id(id));
        resultRepository.deleteAll(resultRepository.findByStudent_Id(id));
        User user = student.getUser();
        studentRepository.delete(student);
        if (user != null) {
            userRepository.delete(user);
        }
    }
    
    public List<LessonScheduleDto> getStudentSchedule(Long studentId) {
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
        return lessonRepository.findByAClass_IdWithDetails(classId).stream()
                .filter(lesson -> lesson.getStartTime() != null && lesson.getEndTime() != null)
                .map(lessonMapper::mapToScheduleDto)
                .collect(Collectors.toList());
    }
}
