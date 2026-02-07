package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Parent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParentRepository extends JpaRepository<Parent,Long> {
}
