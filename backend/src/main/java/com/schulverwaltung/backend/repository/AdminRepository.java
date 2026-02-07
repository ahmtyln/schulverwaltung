package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
}
