package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudent_Id(Long studentId);
}

