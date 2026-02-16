package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    Optional<Grade> findByLevel(@Param("level") int level);
}
