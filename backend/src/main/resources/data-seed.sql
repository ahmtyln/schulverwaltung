-- ============================================================
-- Schulverwaltung - MySQL Seed Data
-- Run this in MySQL (e.g. mysql -u root -p schulverwaltung < data-seed.sql)
-- All user passwords are: password
-- ============================================================

USE schulverwaltung;

-- BCrypt hash for "password" (all users use this for login)
SET @pwd = '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW';

-- -------------------- 1. USERS --------------------
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@school.com', @pwd, 'ADMIN'),
('teacher1', 'teacher1@school.com', @pwd, 'TEACHER'),
('teacher2', 'teacher2@school.com', @pwd, 'TEACHER'),
('parent1', 'parent1@school.com', @pwd, 'PARENT'),
('parent2', 'parent2@school.com', @pwd, 'PARENT'),
('student1', 'student1@school.com', @pwd, 'STUDENT'),
('student2', 'student2@school.com', @pwd, 'STUDENT'),
('student3', 'student3@school.com', @pwd, 'STUDENT');

-- -------------------- 2. GRADE --------------------
INSERT INTO grade (level) VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

-- -------------------- 3. TEACHER (userId: 2=teacher1, 3=teacher2) --------------------
INSERT INTO teacher (name, surname, address, phoneNumber, image, bloodType, sex, userId) VALUES
('Anna', 'Müller', 'Berliner Str. 10, 10115 Berlin', '030-1111111', NULL, 'A+', 'FEMALE', 2),
('Thomas', 'Schmidt', 'Hamburger Str. 5, 20095 Hamburg', '040-2222222', NULL, 'B+', 'MALE', 3);

-- -------------------- 4. PARENT (userId: 4=parent1, 5=parent2) --------------------
INSERT INTO parent (name, surname, phoneNumber, address, userId) VALUES
('Michael', 'Weber', '030-3333333', 'Leipziger Str. 20, 10117 Berlin', 4),
('Sarah', 'Fischer', '040-4444444', 'St. Pauli Hafen 1, 20359 Hamburg', 5);

-- -------------------- 5. ADMIN (userId: 1=admin) --------------------
INSERT INTO admin (name, surname, userId) VALUES
('System', 'Admin', 1);

-- -------------------- 6. CLASS (gradeId 1-10, teacherId 1 or 2) --------------------
INSERT INTO `class` (name, capacity, teacherId, gradeId) VALUES
('1A', 25, 1, 1),
('2A', 24, 1, 2),
('3A', 26, 2, 3),
('4A', 25, 2, 4),
('5A', 24, 1, 5);

-- -------------------- 7. SUBJECT (teacherId 1 or 2) --------------------
INSERT INTO subject (name, teacherId) VALUES
('Mathematics', 1),
('German', 1),
('English', 2),
('Physics', 2),
('History', 1);

-- -------------------- 8. LESSON (subjectId, classId, teacherId) --------------------
INSERT INTO lesson (name, day, startTime, endTime, subjectId, classId, teacherId) VALUES
('Math 1A', 'MONDAY', '2025-09-01 08:00:00', '2025-09-01 08:45:00', 1, 1, 1),
('Math 2A', 'MONDAY', '2025-09-01 09:00:00', '2025-09-01 09:45:00', 1, 2, 1),
('German 1A', 'TUESDAY', '2025-09-02 08:00:00', '2025-09-02 08:45:00', 2, 1, 1),
('English 3A', 'WEDNESDAY', '2025-09-03 10:00:00', '2025-09-03 10:45:00', 3, 3, 2),
('Physics 3A', 'THURSDAY', '2025-09-04 11:00:00', '2025-09-04 11:45:00', 4, 3, 2),
('History 2A', 'FRIDAY', '2025-09-05 08:00:00', '2025-09-05 08:45:00', 5, 2, 1);

-- -------------------- 9. STUDENT (parentId, classId, gradeId, userId) --------------------
-- student1 -> parent1, class 1A, grade 1, user 6
-- student2 -> parent1, class 2A, grade 2, user 7
-- student3 -> parent2, class 3A, grade 3, user 8
INSERT INTO student (name, surname, address, phoneNumber, image, bloodType, sex, parentId, classId, gradeId, userId) VALUES
('Emma', 'Weber', 'Leipziger Str. 20, 10117 Berlin', '030-5555555', NULL, '0+', 'FEMALE', 1, 1, 1, 6),
('Noah', 'Weber', 'Leipziger Str. 20, 10117 Berlin', '030-5555556', NULL, 'A-', 'MALE', 1, 2, 2, 7),
('Mia', 'Fischer', 'St. Pauli Hafen 1, 20359 Hamburg', '040-6666666', NULL, 'B-', 'FEMALE', 2, 3, 3, 8);

-- -------------------- 10. EXAM --------------------
INSERT INTO exam (title, startTime, endTime, lessonId) VALUES
('Mathematics Midterm 1A', '2025-10-15 09:00:00', '2025-10-15 10:30:00', 1),
('German Test 1A', '2025-10-16 08:00:00', '2025-10-16 08:45:00', 3),
('English Quiz 3A', '2025-10-17 10:00:00', '2025-10-17 10:45:00', 4);

-- -------------------- 11. ASSIGNMENT --------------------
INSERT INTO assignment (title, startTime, endTime, lessonId) VALUES
('Math Homework Ch.1', '2025-09-01 00:00:00', '2025-09-15 23:59:00', 1),
('Essay German', '2025-09-02 00:00:00', '2025-09-20 23:59:00', 3),
('Physics Lab Report', '2025-09-04 00:00:00', '2025-09-25 23:59:00', 5);

-- -------------------- 12. RESULT (studentId, examId or assignmentId) --------------------
INSERT INTO result (score, studentId, examId, assignmentId) VALUES
(85, 1, 1, NULL),
(90, 1, 2, NULL),
(78, 2, NULL, 1),
(88, 3, 3, NULL),
(92, 3, NULL, 3);

-- -------------------- 13. EVENT --------------------
INSERT INTO event (title, description, date, classId) VALUES
('Class 1A Trip', 'Museum visit', '2025-10-01 09:00:00', 1),
('Sports Day 2A', 'School sports event', '2025-10-10 08:00:00', 2),
('Parent Meeting 3A', 'Quarterly meeting', '2025-10-20 18:00:00', 3);

-- -------------------- 14. ANNOUNCEMENT --------------------
INSERT INTO announcement (title, description, date, classId) VALUES
('Welcome Back', 'New school year starts Monday.', '2025-09-01 00:00:00', 1),
('Holiday Reminder', 'No school on Oct 3.', '2025-09-25 00:00:00', 2),
('Exam Schedule', 'Midterm exams next week.', '2025-10-01 00:00:00', 3);

-- -------------------- 15. ATTENDANCE --------------------
INSERT INTO attendance (date, present, studentId, lessonId) VALUES
('2025-09-01 08:00:00', 1, 1, 1),
('2025-09-02 08:00:00', 1, 1, 3),
('2025-09-01 09:00:00', 1, 2, 2),
('2025-09-03 10:00:00', 1, 3, 4),
('2025-09-04 11:00:00', 0, 3, 5);

-- ============================================================
-- Login: username from users table, password = "password"
-- admin / password  -> Admin dashboard
-- teacher1 / password -> Teacher
-- parent1 / password -> Parent (children: Emma, Noah)
-- student1 / password -> Student (Emma, class 1A)
-- ============================================================
