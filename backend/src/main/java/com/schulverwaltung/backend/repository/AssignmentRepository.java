package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByLesson_AClass_Id(Long classId);

    @Query("SELECT DISTINCT a FROM Assignment a LEFT JOIN FETCH a.lesson l LEFT JOIN FETCH l.teacher LEFT JOIN FETCH l.subject LEFT JOIN FETCH l.aClass WHERE l.aClass.id = :classId")
    List<Assignment> findByLesson_AClass_IdWithDetails(@Param("classId") Long classId);

    List<Assignment> findByLesson_Id(Long lessonId);

    @Query("SELECT DISTINCT a FROM Assignment a LEFT JOIN FETCH a.lesson l LEFT JOIN FETCH l.teacher LEFT JOIN FETCH l.subject LEFT JOIN FETCH l.aClass WHERE l.teacher.id = :teacherId")
    List<Assignment> findByLesson_Teacher_Id(@Param("teacherId") Long teacherId);

    @Query("SELECT DISTINCT a FROM Assignment a LEFT JOIN FETCH a.lesson l LEFT JOIN FETCH l.teacher LEFT JOIN FETCH l.subject LEFT JOIN FETCH l.aClass")
    List<Assignment> findAllWithLessonAndTeacher();
}

