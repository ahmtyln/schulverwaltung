package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.*;
import com.schulverwaltung.backend.enums.Role;
import com.schulverwaltung.backend.exceptions.EmailAlreadyExistsException;
import com.schulverwaltung.backend.exceptions.UsernameAlreadyExistsException;
import com.schulverwaltung.backend.mapper.LessonMapper;
import com.schulverwaltung.backend.model.Aclass;
import com.schulverwaltung.backend.model.Lesson;
import com.schulverwaltung.backend.model.Subject;
import com.schulverwaltung.backend.model.Teacher;
import com.schulverwaltung.backend.model.User;
import com.schulverwaltung.backend.repository.ClassRepository;
import com.schulverwaltung.backend.repository.LessonRepository;
import com.schulverwaltung.backend.repository.SubjectRepository;
import com.schulverwaltung.backend.repository.TeacherRepository;
import com.schulverwaltung.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherService {
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final LessonRepository lessonRepository;
    private final LessonMapper lessonMapper;
    private final SubjectRepository subjectRepository;
    private final ClassRepository classRepository;

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
        user.setRole(Role.TEACHER);

        Teacher teacher = new Teacher();
        teacher.setName(request.getName());
        teacher.setSurname(request.getSurname());
        teacher.setUser(user);

        teacherRepository.save(teacher);

        RegisterResponseDto responseDto = new RegisterResponseDto();

        responseDto.setSurname(teacher.getSurname());
        responseDto.setEmail(teacher.getUser().getEmail());
        responseDto.setName(teacher.getName());

        return responseDto;
    }

    public RegisterResponseDto teacherProfile(Authentication authentication){
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Benutzer ist nicht gefunden!"));
        Teacher teacher = teacherRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Teacher ist nicht gefunden."));

        RegisterResponseDto responseDto = new RegisterResponseDto();

        responseDto.setSurname(teacher.getSurname());
        responseDto.setEmail(teacher.getUser().getEmail());
        responseDto.setName(teacher.getName());

        return responseDto;
    }

    @Transactional(readOnly = true)
    public List<TeacherResponseDto> getAllTeachers(){
        return teacherRepository.findAll().stream()
                .map(this::toTeacherResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TeacherResponseDto getOneTeacher(Long id){
        Teacher teacher = teacherRepository.findById(id).orElseThrow(() -> new RuntimeException("Teacher ist nicht gefunden."));
        return toTeacherResponseDto(teacher);
    }

    private TeacherResponseDto toTeacherResponseDto(Teacher t) {
        List<TeacherResponseDto.IdName> subjects = t.getSubjects() == null ? new ArrayList<>() : t.getSubjects().stream()
                .map(s -> new TeacherResponseDto.IdName(s.getId(), s.getName()))
                .collect(Collectors.toList());
        List<TeacherResponseDto.IdName> lessons = t.getLessons() == null ? new ArrayList<>() : t.getLessons().stream()
                .map(l -> new TeacherResponseDto.IdName(l.getId(), l.getName()))
                .collect(Collectors.toList());
        List<TeacherResponseDto.IdName> aclasses = t.getAclasses() == null ? new ArrayList<>() : t.getAclasses().stream()
                .map(c -> new TeacherResponseDto.IdName(c.getId(), c.getName()))
                .collect(Collectors.toList());
        TeacherResponseDto.UserSummary userSummary = null;
        if (t.getUser() != null) {
            User u = t.getUser();
            userSummary = TeacherResponseDto.UserSummary.builder()
                    .id(u.getId())
                    .username(u.getUsername())
                    .email(u.getEmail())
                    .build();
        }
        return TeacherResponseDto.builder()
                .id(t.getId())
                .name(t.getName())
                .surname(t.getSurname())
                .address(t.getAddress() != null ? t.getAddress() : "")
                .phone(t.getPhone())
                .image(t.getImage())
                .bloodType(t.getBloodType())
                .sex(t.getSex())
                .createdAt(t.getCreatedAt())
                .subjects(subjects)
                .lessons(lessons)
                .aclasses(aclasses)
                .user(userSummary)
                .build();
    }

    @Transactional
    public TeacherResponseDto createTeacher(AddTeacherRequestDto request) {

        User user = User.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.TEACHER)
                .build();

        Teacher teacher = Teacher.builder()
                .name(request.getName())
                .surname(request.getSurname())
                .phone(request.getPhone())
                .address(request.getAddress() != null ? request.getAddress() : "")
                .bloodType(request.getBloodType())
                .user(user)
                .build();

        teacher = teacherRepository.save(teacher);

        if (request.getLessonIds() != null && !request.getLessonIds().isEmpty()) {
            List<Lesson> lessons = lessonRepository.findAllById(request.getLessonIds());
            for (Lesson l : lessons) {
                l.setTeacher(teacher);
            }
            lessonRepository.saveAll(lessons);
            teacher.setLessons(lessons);

            List<Subject> subjects = lessons.stream()
                    .map(Lesson::getSubject)
                    .filter(s -> s != null)
                    .collect(Collectors.toMap(Subject::getId, s -> s, (a, b) -> a))
                    .values().stream().toList();
            for (Subject s : subjects) {
                s.setTeacher(teacher);
            }
            if (!subjects.isEmpty()) {
                subjectRepository.saveAll(subjects);
            }

            List<Aclass> classes = lessons.stream()
                    .map(Lesson::getAClass)
                    .filter(c -> c != null)
                    .collect(Collectors.toMap(Aclass::getId, c -> c, (a, b) -> a))
                    .values().stream().toList();
            for (Aclass c : classes) {
                c.setTeacher(teacher);
            }
            if (!classes.isEmpty()) {
                classRepository.saveAll(classes);
            }
        }

        return toTeacherResponseDto(teacher);
    }


    @Transactional
    public TeacherResponseDto updateTeacher(Long id, UpdateTeacherRequestDto request) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow();

        teacher.setName(request.getName());
        teacher.setSurname(request.getSurname());
        teacher.setPhone(request.getPhone());
        if (request.getAddress() != null) {
            teacher.setAddress(request.getAddress());
        }
        if (request.getBloodType() != null) {
            teacher.setBloodType(request.getBloodType());
        }

        if (request.getLessonIds() != null) {
            List<Lesson> lessons = lessonRepository.findAllById(request.getLessonIds());
            for (Lesson l : lessons) {
                l.setTeacher(teacher);
            }
            lessonRepository.saveAll(lessons);
            teacher.setLessons(lessons);

            List<Subject> subjects = lessons.stream()
                    .map(Lesson::getSubject)
                    .filter(s -> s != null)
                    .collect(Collectors.toMap(Subject::getId, s -> s, (a, b) -> a))
                    .values().stream().toList();
            for (Subject s : subjects) {
                s.setTeacher(teacher);
            }
            if (!subjects.isEmpty()) {
                subjectRepository.saveAll(subjects);
            }

            List<Aclass> classes = lessons.stream()
                    .map(Lesson::getAClass)
                    .filter(c -> c != null)
                    .collect(Collectors.toMap(Aclass::getId, c -> c, (a, b) -> a))
                    .values().stream().toList();
            for (Aclass c : classes) {
                c.setTeacher(teacher);
            }
            if (!classes.isEmpty()) {
                classRepository.saveAll(classes);
            }
        }

        if (teacher.getUser() != null && request.getEmail() != null) {
            teacher.getUser().setEmail(request.getEmail());
        }

        teacher = teacherRepository.save(teacher);
        return toTeacherResponseDto(teacher);
    }

    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(() -> new RuntimeException("Teacher not found"));
        List<Lesson> lessons = teacher.getLessons();
        if (lessons != null && !lessons.isEmpty()) {
            for (Lesson l : lessons) {
                l.setTeacher(null);
            }
            lessonRepository.saveAll(lessons);
        }
        List<Subject> subjects = teacher.getSubjects();
        if (subjects != null && !subjects.isEmpty()) {
            for (Subject s : subjects) {
                s.setTeacher(null);
            }
            subjectRepository.saveAll(subjects);
        }
        List<Aclass> aclasses = teacher.getAclasses();
        if (aclasses != null && !aclasses.isEmpty()) {
            for (Aclass c : aclasses) {
                c.setTeacher(null);
            }
            classRepository.saveAll(aclasses);
        }
        teacherRepository.delete(teacher);
    }

    public List<LessonScheduleDto> getTeacherSchedule(Long teacherId) {
        Teacher teacher = teacherRepository.findByIdWithLessons(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher ist nicht gefunden."));

        return teacher.getLessons().stream()
                .filter(lesson -> lesson.getStartTime() != null && lesson.getEndTime() != null)
                .map(lessonMapper::mapToScheduleDto)
                .collect(Collectors.toList());
    }



}
