package com.schulverwaltung.backend.DTOs;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.schulverwaltung.backend.enums.UserSex;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeacherResponseDto {
    @JsonProperty("teacherId")
    private Long id;
    private String name;
    private String surname;
    private String address;
    private String phone;
    private String image;
    private String bloodType;
    private UserSex sex;
    private LocalDateTime createdAt;
    private List<IdName> subjects;
    private List<IdName> lessons;
    private List<IdName> aclasses;
    private UserSummary user;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class IdName {
        private Long id;
        private String name;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class UserSummary {
        private Long id;
        private String username;
        private String email;
    }
}
