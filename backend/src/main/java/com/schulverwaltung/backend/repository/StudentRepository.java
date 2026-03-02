package com.schulverwaltung.backend.repository;

import com.schulverwaltung.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface StudentRepository extends JpaRepository <Student,Long> {
    Optional<Student> findByUserId(Long userId);
    List<Student> findByParentId(Long parentId);
    List<Student> findByParent_Id(Long parentId);

    @Query("SELECT s FROM Student s " +
            "LEFT JOIN FETCH s.aClass c " +
            "LEFT JOIN FETCH c.lessons l " +
            "LEFT JOIN FETCH l.subject sub " +
            "WHERE s.id = :id")
    Optional<Student> findByIdWithClassAndLessons(@Param("id") Long id);

    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.aClass WHERE s.id = :id")
    Optional<Student> findByIdWithAClass(@Param("id") Long id);

    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.aClass WHERE s.parent.id = :parentId")
    List<Student> findByParent_IdWithAClass(@Param("parentId") Long parentId);

    boolean existsByPhone(String phone);

    boolean existsByPhoneAndIdNot(String phone, Long id);
}
