package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByUserId(Long id);
}
