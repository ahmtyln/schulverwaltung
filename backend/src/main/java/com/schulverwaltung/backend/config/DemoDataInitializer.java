package com.schulverwaltung.backend.config;

import com.schulverwaltung.backend.enums.Role;
import com.schulverwaltung.backend.enums.UserSex;
import com.schulverwaltung.backend.model.*;
import com.schulverwaltung.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Profile("!prod") // demo verisi sadece prod DIŞI profillerde yüklensin
public class DemoDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ClassRepository classRepository;
    private final GradeRepository gradeRepository;
    private final LessonRepository lessonRepository;
    private final ExamRepository examRepository;
    private final AssignmentRepository assignmentRepository;
    private final ResultRepository resultRepository;
    private final AttendanceRepository attendanceRepository;
    private final EventRepository eventRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Eğer zaten veri varsa (en az bir user), hiçbir şey yapma
        // Böylece uygulama her restart'ta veriyi sıfırlamaya çalışmaz.
        if (userRepository.count() > 0) {
            return;
        }

        String demoPassword = passwordEncoder.encode("12345678");

        // ADMIN
        User admin = User.builder()
                .username("admin")
                .email("admin@example.com")
                .password(demoPassword)
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);

        // Grades (1–3)
        List<Grade> grades = new ArrayList<>();
        for (int level = 1; level <= 3; level++) {
            Grade g = new Grade();
            g.setLevel(level);
            grades.add(gradeRepository.save(g));
        }

        // Teachers (10)
        List<Teacher> teachers = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            User u = User.builder()
                    .username("teacher" + i)
                    .email("teacher" + i + "@example.com")
                    .password(demoPassword)
                    .role(Role.TEACHER)
                    .build();

            Teacher t = Teacher.builder()
                    .name("Teacher " + i)
                    .surname("Demo")
                    .address("Teacher Street " + i)
                    .phone("05000000" + String.format("%02d", i))
                    .image(null)
                    .bloodType("A+")
                    .sex(i % 2 == 0 ? UserSex.FEMALE : UserSex.MALE)
                    .user(u)
                    .build();
            teachers.add(teacherRepository.save(t));
        }

        // Parents (10)
        List<Parent> parents = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            User u = User.builder()
                    .username("parent" + i)
                    .email("parent" + i + "@example.com")
                    .password(demoPassword)
                    .role(Role.PARENT)
                    .build();

            Parent p = Parent.builder()
                    .name("Parent " + i)
                    .surname("Demo")
                    .phone("06000000" + String.format("%02d", i))
                    .address("Parent Street " + i)
                    .user(u)
                    .build();
            parents.add(parentRepository.save(p));
        }

        // Classes (10)
        List<Aclass> classes = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            Grade grade = grades.get((i - 1) % grades.size());
            Teacher teacher = teachers.get((i - 1) % teachers.size());
            Aclass c = Aclass.builder()
                    .name("Class " + i)
                    .capacity(30)
                    .grade(grade)
                    .build();
            c.setTeacher(teacher);
            classes.add(classRepository.save(c));
        }

        // Students (10)
        List<Student> students = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            User u = User.builder()
                    .username("student" + i)
                    .email("student" + i + "@example.com")
                    .password(demoPassword)
                    .role(Role.STUDENT)
                    .build();

            Parent parent = parents.get((i - 1) % parents.size());
            Aclass cls = classes.get((i - 1) % classes.size());
            Grade grade = cls.getGrade();

            Student s = Student.builder()
                    .name("Student " + i)
                    .surname("Demo")
                    .address("Student Street " + i)
                    .phone("07000000" + String.format("%02d", i))
                    .image(null)
                    .bloodType("0+")
                    .sex(i % 2 == 0 ? UserSex.FEMALE : UserSex.MALE)
                    .parent(parent)
                    .aClass(cls)
                    .grade(grade)
                    .user(u)
                    .build();
            students.add(studentRepository.save(s));
        }

        // Subjects (10) – öğretmenlere dağıt
        List<Subject> subjects = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            Teacher teacher = teachers.get((i - 1) % teachers.size());
            Subject subject = new Subject();
            subject.setName("Subject " + i);
            subject.setTeacher(teacher);
            subjects.add(subjectRepository.save(subject));
        }

        // Lessons (10)
        List<Lesson> lessons = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            Teacher teacher = teachers.get((i - 1) % teachers.size());
            Aclass cls = classes.get((i - 1) % classes.size());
            Subject subject = subjects.get((i - 1) % subjects.size());

            Lesson lesson = new Lesson();
            lesson.setName("Lesson " + i);
            lesson.setTeacher(teacher);
            lesson.setAClass(cls);
            lesson.setSubject(subject);
            lesson.setStartTime(LocalDateTime.now().withHour(8 + (i % 5)).withMinute(0));
            lesson.setEndTime(LocalDateTime.now().withHour(9 + (i % 5)).withMinute(0));
            lessons.add(lessonRepository.save(lesson));
        }

        // Exams (10)
        List<Exam> exams = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            Lesson lesson = lessons.get((i - 1) % lessons.size());
            Exam exam = new Exam();
            exam.setTitle("Exam " + i);
            exam.setLesson(lesson);
            exam.setStartTime(LocalDateTime.now().plusDays(i));
            exam.setEndTime(LocalDateTime.now().plusDays(i).plusHours(1));
            exams.add(examRepository.save(exam));
        }

        // Assignments (10)
        List<Assignment> assignments = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            Lesson lesson = lessons.get((i - 1) % lessons.size());
            Assignment a = new Assignment();
            a.setTitle("Assignment " + i);
            a.setLesson(lesson);
            a.setEndTime(LocalDateTime.now().plusDays(7 + i));
            assignments.add(assignmentRepository.save(a));
        }

        // Results (10) – bazıları exam, bazıları assignment
        for (int i = 1; i <= 10; i++) {
            Student student = students.get((i - 1) % students.size());
            Result r = new Result();
            r.setStudent(student);
            r.setScore(60 + (i % 40));
            if (i % 2 == 0) {
                r.setExam(exams.get((i - 1) % exams.size()));
            } else {
                r.setAssignment(assignments.get((i - 1) % assignments.size()));
            }
            resultRepository.save(r);
        }

        // Attendance (10)
        for (int i = 1; i <= 10; i++) {
            Student student = students.get((i - 1) % students.size());
            Lesson lesson = lessons.get((i - 1) % lessons.size());
            Attendance att = new Attendance();
            att.setStudent(student);
            att.setLesson(lesson);
            att.setDate(LocalDateTime.now().minusDays(i));
            att.setPresent(i % 3 != 0); // bazısı devamsız
            attendanceRepository.save(att);
        }

        // Events (5)
        for (int i = 1; i <= 5; i++) {
            Aclass cls = classes.get((i - 1) % classes.size());
            Event e = new Event();
            e.setTitle("Event " + i);
            e.setDescription("Demo event " + i);
            e.setDate(LocalDateTime.now().plusDays(i));
             // Örnek fiyatlar: 10, 20, 30, 40, 50 €
            e.setPrice(BigDecimal.valueOf(10L * i));
            e.setAClass(cls);
            eventRepository.save(e);
        }

        // Announcements (5)
        for (int i = 1; i <= 5; i++) {
            Aclass cls = classes.get((i - 1) % classes.size());
            Announcement a = new Announcement();
            a.setTitle("Announcement " + i);
            a.setDescription("Demo announcement " + i);
            a.setDate(LocalDateTime.now().minusDays(i));
            a.setAClass(cls);
            announcementRepository.save(a);
        }
    }
}

