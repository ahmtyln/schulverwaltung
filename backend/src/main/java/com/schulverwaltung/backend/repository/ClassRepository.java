package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Aclass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ClassRepository extends JpaRepository<Aclass, Long> {
    Optional<Aclass> findByName(@Param("name") String name);
}
