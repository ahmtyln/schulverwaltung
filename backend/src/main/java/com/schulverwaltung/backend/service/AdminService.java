package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.DTOs.*;
import com.schulverwaltung.backend.enums.Role;
import com.schulverwaltung.backend.exceptions.EmailAlreadyExistsException;
import com.schulverwaltung.backend.exceptions.UsernameAlreadyExistsException;
import com.schulverwaltung.backend.mapper.ParentListMapper;
import com.schulverwaltung.backend.mapper.StudentListMapper;
import com.schulverwaltung.backend.mapper.TeacherListMapper;
import com.schulverwaltung.backend.model.*;
import com.schulverwaltung.backend.model.Aclass;
import com.schulverwaltung.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final TeacherRepository teacherRepository;
    private final GradeRepository gradeRepository;
    private final ClassRepository classRepository;
    private final PasswordEncoder passwordEncoder;
    private final ParentListMapper parentListMapper;
    private final StudentListMapper studentListMapper;
    private final TeacherListMapper teacherListMapper;

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
        user.setRole(Role.ADMIN);

        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setSurname(request.getSurname());
        admin.setUser(user);

        adminRepository.save(admin);

        RegisterResponseDto responseDto = new RegisterResponseDto();

        responseDto.setSurname(admin.getSurname());
        responseDto.setEmail(admin.getUser().getEmail());
        responseDto.setName(admin.getName());

        return responseDto;
    }

    public RegisterResponseDto adminProfile(Authentication authentication){
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username ist nicht gefunden!"));
        Admin admin = adminRepository.findByUserId(user.getId()).orElseThrow(()-> new RuntimeException("Admin ist nicht gefunden."));

        RegisterResponseDto responseDto = new RegisterResponseDto();

        responseDto.setSurname(admin.getSurname());
        responseDto.setEmail(admin.getUser().getEmail());
        responseDto.setName(admin.getName());

        return responseDto;

    }

    public Page<StudentListDto> getAllStudents(Pageable pageable){
        Page<Student> studentPage = studentRepository.findAll(pageable);

        return studentPage.map(s-> studentListMapper.toStudentListDto(s));
    }

    public Page<ParentListDto> getAllParents(Pageable pageable){
        Page<Parent> parentPage = parentRepository.findAll(pageable);

        return parentPage.map(p-> parentListMapper.toParentListDto(p));
    }

    public Page<TeacherListDto> getAllTeachers(Pageable pageable){
        Page<Teacher> teacherPage = teacherRepository.findAll(pageable);

        return teacherPage.map(t-> teacherListMapper.toTeacherListDto(t));
    }

    public StudentResponseDto addStudent(AddStudentRequestDto request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistsException("Student ist schon existiert.");
        }

        Grade grade = gradeRepository.findByLevel(request.getGradeLevel()).orElseThrow(()-> new RuntimeException("Grade ist nicht gefunden."));
        Aclass aClass = classRepository.findByName(request.getClassName()).orElseThrow(()-> new RuntimeException("Class ist nicht gefunden."));

        User user = User.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .build();

        Student student = Student.builder()
                .name(request.getName())
                .surname(request.getSurname())
                .phone(request.getPhone())
                .user(user)
                .grade(grade)
                .aClass(aClass)
                .build();

        studentRepository.save(student);

        return StudentResponseDto.builder()
                .id(student.getId())
                .fullName(student.getName() + " " + student.getSurname())
                .email(student.getUser().getEmail())
                .className(student.getAClass().getName())
                .gradeLevel(student.getGrade().getLevel())
                .createdAt(student.getCreatedAt())
                .build();

    }

    public StudentResponseDto updateStudent(Long id, UpdateStudentRequestDto request){
        if (!id.equals(request.getId())) {
            throw new RuntimeException("Path ID ≠ Body ID!");
        }

        Student student = studentRepository.findById(id).orElse(null);
        if(student == null){
            throw new RuntimeException("Student ist nicht gefunden.");
        }

        Grade grade = gradeRepository.findByLevel(request.getGradeLevel()).orElseThrow();
        Aclass aClass = classRepository.findByName(request.getClassName()).orElseThrow();

        student.setName(request.getName());
        student.setSurname(request.getSurname());
        student.setAddress(request.getAddress());
        student.setPhone(request.getPhone());
        student.setGrade(grade);
        student.setAClass(aClass);
        studentRepository.save(student);

        return StudentResponseDto.builder()
                .id(student.getId())
                .fullName(student.getName() + " " + student.getSurname())
                .email(student.getUser().getEmail())
                .className(student.getAClass().getName())
                .gradeLevel(student.getGrade().getLevel())
                .createdAt(student.getCreatedAt())
                .build();
    }

    public void deleteStudent(Long id){
        Student student = studentRepository.findById(id).orElse(null);
        if(student == null){
            throw new RuntimeException("Student ist nicht gefunden.");
        }

        studentRepository.delete(student);

    }
}
