-- Clear + seed (snake_case columns)
USE schulverwaltung;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE attendance;
TRUNCATE TABLE result;
TRUNCATE TABLE exam;
TRUNCATE TABLE assignment;
TRUNCATE TABLE announcement;
TRUNCATE TABLE event;
TRUNCATE TABLE lesson;
TRUNCATE TABLE subject;
TRUNCATE TABLE student;
TRUNCATE TABLE `class`;
TRUNCATE TABLE teacher;
TRUNCATE TABLE parent;
TRUNCATE TABLE admin;
TRUNCATE TABLE grade;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

SET @pwd = '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW';

INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@school.com', @pwd, 'ADMIN'),
('teacher1', 'teacher1@school.com', @pwd, 'TEACHER'),
('teacher2', 'teacher2@school.com', @pwd, 'TEACHER'),
('parent1', 'parent1@school.com', @pwd, 'PARENT'),
('parent2', 'parent2@school.com', @pwd, 'PARENT'),
('student1', 'student1@school.com', @pwd, 'STUDENT'),
('student2', 'student2@school.com', @pwd, 'STUDENT'),
('student3', 'student3@school.com', @pwd, 'STUDENT');

INSERT INTO grade (level) VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10);

INSERT INTO teacher (name, surname, address, phone_number, image, blood_type, sex, user_id) VALUES
('Anna', 'Müller', 'Berliner Str. 10, 10115 Berlin', '030-1111111', NULL, 'A+', 'FEMALE', 2),
('Thomas', 'Schmidt', 'Hamburger Str. 5, 20095 Hamburg', '040-2222222', NULL, 'B+', 'MALE', 3);

INSERT INTO parent (name, surname, phone_number, address, user_id) VALUES
('Michael', 'Weber', '030-3333333', 'Leipziger Str. 20, 10117 Berlin', 4),
('Sarah', 'Fischer', '040-4444444', 'St. Pauli Hafen 1, 20359 Hamburg', 5);

INSERT INTO admin (name, surname, user_id) VALUES ('System', 'Admin', 1);

INSERT INTO `class` (name, capacity, teacher_id, grade_id) VALUES
('1A', 25, 1, 1), ('2A', 24, 1, 2), ('3A', 26, 2, 3), ('4A', 25, 2, 4), ('5A', 24, 1, 5);

INSERT INTO subject (name, teacher_id) VALUES
('Mathematics', 1), ('German', 1), ('English', 2), ('Physics', 2), ('History', 1);

-- day: 0=MONDAY, 1=TUESDAY, 2=WEDNESDAY, 3=THURSDAY, 4=FRIDAY
INSERT INTO lesson (name, day, start_time, end_time, subject_id, class_id, teacher_id) VALUES
('Math 1A', 0, '2025-09-01 08:00:00', '2025-09-01 08:45:00', 1, 1, 1),
('Math 2A', 0, '2025-09-01 09:00:00', '2025-09-01 09:45:00', 1, 2, 1),
('German 1A', 1, '2025-09-02 08:00:00', '2025-09-02 08:45:00', 2, 1, 1),
('English 3A', 2, '2025-09-03 10:00:00', '2025-09-03 10:45:00', 3, 3, 2),
('Physics 3A', 3, '2025-09-04 11:00:00', '2025-09-04 11:45:00', 4, 3, 2),
('History 2A', 4, '2025-09-05 08:00:00', '2025-09-05 08:45:00', 5, 2, 1);

INSERT INTO student (name, surname, address, phone_number, image, blood_type, sex, parent_id, class_id, grade_id, user_id) VALUES
('Emma', 'Weber', 'Leipziger Str. 20, 10117 Berlin', '030-5555555', NULL, '0+', 'FEMALE', 1, 1, 1, 6),
('Noah', 'Weber', 'Leipziger Str. 20, 10117 Berlin', '030-5555556', NULL, 'A-', 'MALE', 1, 2, 2, 7),
('Mia', 'Fischer', 'St. Pauli Hafen 1, 20359 Hamburg', '040-6666666', NULL, 'B-', 'FEMALE', 2, 3, 3, 8);

INSERT INTO exam (title, start_time, end_time, lesson_id) VALUES
('Mathematics Midterm 1A', '2025-10-15 09:00:00', '2025-10-15 10:30:00', 1),
('German Test 1A', '2025-10-16 08:00:00', '2025-10-16 08:45:00', 3),
('English Quiz 3A', '2025-10-17 10:00:00', '2025-10-17 10:45:00', 4);

INSERT INTO assignment (title, start_time, end_time, lesson_id) VALUES
('Math Homework Ch.1', '2025-09-01 00:00:00', '2025-09-15 23:59:00', 1),
('Essay German', '2025-09-02 00:00:00', '2025-09-20 23:59:00', 3),
('Physics Lab Report', '2025-09-04 00:00:00', '2025-09-25 23:59:00', 5);

INSERT INTO result (score, student_id, exam_id, assignment_id) VALUES
(85, 1, 1, NULL), (90, 1, 2, NULL), (78, 2, NULL, 1), (88, 3, 3, NULL), (92, 3, NULL, 3);

INSERT INTO event (title, description, date, class_id) VALUES
('Class 1A Trip', 'Museum visit', '2025-10-01 09:00:00', 1),
('Sports Day 2A', 'School sports event', '2025-10-10 08:00:00', 2),
('Parent Meeting 3A', 'Quarterly meeting', '2025-10-20 18:00:00', 3);

INSERT INTO announcement (title, description, date, class_id) VALUES
('Welcome Back', 'New school year starts Monday.', '2025-09-01 00:00:00', 1),
('Holiday Reminder', 'No school on Oct 3.', '2025-09-25 00:00:00', 2),
('Exam Schedule', 'Midterm exams next week.', '2025-10-01 00:00:00', 3);

INSERT INTO attendance (date, present, student_id, lesson_id) VALUES
('2025-09-01 08:00:00', 1, 1, 1), ('2025-09-02 08:00:00', 1, 1, 3), ('2025-09-01 09:00:00', 1, 2, 2),
('2025-09-03 10:00:00', 1, 3, 4), ('2025-09-04 11:00:00', 0, 3, 5);
