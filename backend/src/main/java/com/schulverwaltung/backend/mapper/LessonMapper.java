package com.schulverwaltung.backend.mapper;

import com.schulverwaltung.backend.DTOs.LessonScheduleDto;
import com.schulverwaltung.backend.model.Lesson;
import org.springframework.stereotype.Component;

@Component
public class LessonMapper {
    public LessonScheduleDto mapToScheduleDto(Lesson lesson) {
        LessonScheduleDto dto = new LessonScheduleDto();
        dto.setLessonId(lesson.getId());
        dto.setTitle(lesson.getName());
        dto.setClassName(lesson.getAClass() != null ? lesson.getAClass().getName() : "");
        dto.setSubjectName(lesson.getSubject() != null ? lesson.getSubject().getName() : "");
        dto.setStartTime(lesson.getStartTime());
        dto.setEndTime(lesson.getEndTime());
        return dto;
    }
}
