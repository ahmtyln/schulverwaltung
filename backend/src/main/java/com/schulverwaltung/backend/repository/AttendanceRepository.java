package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudent_Id(Long studentId);
    List<Attendance> findByLesson_Id(Long lessonId);

    @Query("SELECT a FROM Attendance a WHERE a.lesson.teacher.id = :teacherId")
    List<Attendance> findByLesson_Teacher_Id(@Param("teacherId") Long teacherId);
}
