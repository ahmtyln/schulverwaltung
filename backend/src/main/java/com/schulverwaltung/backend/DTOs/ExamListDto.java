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
public class ExamListDto {
    private Long id;
    private String title;
    private String subjectName;
    private String className;
    private String teacherName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long lessonId;
}

