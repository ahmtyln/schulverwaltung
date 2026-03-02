package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByUserId(Long id);
    @Query("SELECT t FROM Teacher t " +
            "LEFT JOIN FETCH t.lessons l " +
            "LEFT JOIN FETCH l.subject s " +
            "LEFT JOIN FETCH l.aClass c " +
            "WHERE t.id = :id")
    Optional<Teacher> findByIdWithLessons(@Param("id") Long id);
}
