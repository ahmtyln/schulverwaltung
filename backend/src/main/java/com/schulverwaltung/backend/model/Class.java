package com.schulverwaltung.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Id;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "class")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "classId")
    @JsonProperty("classId")
    private Long id;

    @Column(name = "name",nullable = false)
    private String name;

    @Column(name = "capacity")
    private int capacity;

    @OneToMany(mappedBy = "aClass",fetch = FetchType.LAZY,cascade = CascadeType.PERSIST)
    private List<Lesson> lessons = new ArrayList<>();

    @OneToMany(mappedBy = "aClass",fetch = FetchType.LAZY,cascade = CascadeType.PERSIST)
    private List<Student> students = new ArrayList<>();

    @OneToMany(mappedBy = "aClass",fetch = FetchType.LAZY,cascade = CascadeType.PERSIST)
    private List<Announcement> announcements = new ArrayList<>();

    @OneToMany(mappedBy = "aClass",fetch = FetchType.LAZY,cascade = CascadeType.PERSIST)
    private List<Event> events = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacherId")
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gradeId",nullable = false)
    private Grade grade;


}
