package com.schulverwaltung.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table (name = "parent")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parentId")
    @JsonProperty("parentId")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    @Column(name = "phoneNumber",unique = true)
    private String phone;

    @Column(name = "address")
    private String address;

    @CreationTimestamp
    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @JsonIgnore
    @Builder.Default
    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private List<Student> students = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY,cascade = CascadeType.PERSIST,optional = false)
    @JoinColumn(name = "userId", nullable = false, unique = true)
    private User user;


}
