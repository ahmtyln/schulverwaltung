package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT e FROM Event e WHERE e.aClass.id = :classId")
    List<Event> findByClassId(@Param("classId") Long classId);
}
