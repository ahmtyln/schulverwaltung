package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

    @Query("SELECT DISTINCT l FROM Lesson l LEFT JOIN FETCH l.aClass LEFT JOIN FETCH l.subject WHERE l.aClass.id = :classId")
    List<Lesson> findByAClass_IdWithDetails(@Param("classId") Long classId);
}
