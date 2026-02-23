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
@Table(name = "teacher")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher {
    @Id
    @Column(name = "teacherId")
    @JsonProperty("teacherId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @Builder.Default
    @OneToMany(mappedBy = "teacher", fetch = FetchType.LAZY,cascade = CascadeType.PERSIST)
    private List<Subject> subjects = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "teacher", fetch = FetchType.LAZY,cascade = CascadeType.PERSIST)
    private List<Lesson> lessons = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "teacher", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private List<Aclass> aclasses = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "userId", nullable = false, unique = true)
    private User user;

}
