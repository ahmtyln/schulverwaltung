package com.schulverwaltung.backend.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateParentRequestDto {

    @NotNull
    private Long id;
    private String name;
    private String surname;
    private String phone;
    private List<Long> studentIds;
}
