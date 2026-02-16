package com.schulverwaltung.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.schulverwaltung.backend.enums.UserSex;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {
    @Id
    @Column(name = "studentId")
    @JsonProperty("studentId")
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "surname")
    private String surname;

    @Column(name = "address")
    private String address;

    @Column(name = "phoneNumber",unique = true)
    private String phone;

    @Column(name = "image")
    private String image;

    @Column(name = "bloodType")
    private String bloodType;

    @Enumerated(EnumType.STRING)
    @Column(name = "sex")
    private UserSex sex;

    @CreationTimestamp
    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parentId")
    private Parent parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classId")
    private Aclass aClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gradeId")
    private Grade grade;

    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private List<Result> results = new ArrayList<>();

    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private List<Attendance> attendances = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY,cascade = CascadeType.PERSIST,optional = false)
    @JoinColumn(name = "userId", nullable = false, unique = true)
    private User user;
}
