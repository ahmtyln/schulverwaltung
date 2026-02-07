package com.schulverwaltung.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.schulverwaltung.backend.enums.UserSex;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
public class Student {
    @Id
    @Column(name = "studentId")
    @JsonProperty("studentId")
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true,nullable = false)
    private String username;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "surname")
    private String surname;

    @Email(message = "Geben Sie bitte gültige email adresse ein.")
    @Column(name = "email", unique = true)
    private String email;

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
    private Class aClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gradeId", nullable = false)
    private Grade grade;

    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private List<Result> results = new ArrayList<>();

    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private List<Attendance> attendances = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "userId", nullable = false, unique = true)
    private User user;
}
