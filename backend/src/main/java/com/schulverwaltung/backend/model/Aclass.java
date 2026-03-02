package com.schulverwaltung.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.Id;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "class")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Aclass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "classId")
    @JsonProperty("classId")
    private Long id;

    @Column(name = "name",nullable = true)
    private String name;

    @Column(name = "capacity", nullable = true)
    private Integer capacity;

    @JsonIgnore
    @OneToMany(mappedBy = "aClass",fetch = FetchType.LAZY,cascade = CascadeType.PERSIST)
    private List<Lesson> lessons = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "aClass",fetch = FetchType.LAZY,cascade = CascadeType.PERSIST)
    private List<Student> students = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "aClass",fetch = FetchType.LAZY,cascade = CascadeType.PERSIST)
    private List<Announcement> announcements = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "aClass",fetch = FetchType.LAZY,cascade = CascadeType.PERSIST)
    private List<Event> events = new ArrayList<>();

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacherId")
    private Teacher teacher;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gradeId",nullable = false)
    private Grade grade;


}
