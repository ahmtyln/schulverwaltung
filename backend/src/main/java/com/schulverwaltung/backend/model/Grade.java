package com.schulverwaltung.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "grade")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gradeId")
    @JsonProperty("gradeId")
    private Long id;

    @Column(name = "level",unique = true,nullable = false)
    private int level;

    @OneToMany(mappedBy = "grade", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private List<Class> classes = new ArrayList<>();

    @OneToMany(mappedBy = "grade", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private List<Student> students = new ArrayList<>();
}
