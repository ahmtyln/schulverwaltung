package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Parent;
import com.schulverwaltung.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParentRepository extends JpaRepository<Parent,Long> {
    Optional<Parent> findByUserId(Long userId);
}
