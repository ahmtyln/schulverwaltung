package com.schulverwaltung.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.schulverwaltung.backend.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userId")
    @JsonProperty("userId")
    private Long id;

    @Column(name = "username",nullable = false,unique = true,length = 100)
    private String username;

    @Email(message = "Geben Sie bitte gültige email adresse ein.")
    @Column(name = "email",nullable = false,unique = true,length = 100)
    private String email;

    @Column(name = "password",nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role",nullable = false)
    private Role role;


}


