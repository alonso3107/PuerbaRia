package com.puerbaria.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record FotoHabitacionDto(
        @NotBlank(message = "La ruta de la foto es obligatoria")
        String src,

        @NotBlank(message = "El texto alternativo de la foto es obligatorio")
        String alt) {
}
