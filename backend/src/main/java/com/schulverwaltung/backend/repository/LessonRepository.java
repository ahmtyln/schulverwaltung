package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson,Long> {

}
