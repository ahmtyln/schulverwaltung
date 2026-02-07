package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}
