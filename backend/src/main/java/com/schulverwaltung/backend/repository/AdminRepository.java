package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Admin;
import com.schulverwaltung.backend.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUserId(Long id);
}
