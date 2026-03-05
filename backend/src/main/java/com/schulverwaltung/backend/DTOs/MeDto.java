package com.schulverwaltung.backend.DTOs;

import com.schulverwaltung.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeDto {
    private Role role;
    private Long studentId;
    private Long teacherId;
    private Long parentId;
    private Long adminId;
    /** Öğrenci girişi ise kendi id; veli girişi ise çocuklarının id'leri */
    private List<Long> studentIds;
    /** Veli/öğrenci için çocuk/öğrenci id + adı (buton ve başlıkta gösterim) */
    private List<MeStudentSummaryDto> studentSummaries;
    /** Öğrenci girişi ise sınıf id (sınav listesi için) */
    private Long classId;
    /** Öğretmen girişi ise ders verdiği / sınıf öğretmeni olduğu sınıf id'leri */
    private List<Long> classIds;
}
