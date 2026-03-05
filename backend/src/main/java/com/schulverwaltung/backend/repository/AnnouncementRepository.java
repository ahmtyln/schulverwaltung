package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    @Query("SELECT a FROM Announcement a WHERE a.aClass.id = :classId")
    List<Announcement> findByClassId(@Param("classId") Long classId);
}
