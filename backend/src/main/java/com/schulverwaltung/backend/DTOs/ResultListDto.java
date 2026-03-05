package com.schulverwaltung.backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultListDto {
    private Long id;
    private String title;
    private String subjectName;
    private String className;
    private String studentName;
    private String teacherName;
    private int score;
    private LocalDateTime date;
    private String type; // "EXAM" or "ASSIGNMENT"
    private Long studentId;
    private Long examId;
    private Long assignmentId;
}

