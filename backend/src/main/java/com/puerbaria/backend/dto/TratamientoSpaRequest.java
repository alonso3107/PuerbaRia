package com.puerbaria.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record TratamientoSpaRequest(
        @NotBlank(message = "El icono es obligatorio")
        @Size(max = 50, message = "El icono no debe superar los 50 caracteres")
        String icono,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no debe superar los 100 caracteres")
        String nombre,

        @NotBlank(message = "La descripcion es obligatoria")
        @Size(max = 1000, message = "La descripcion no debe superar los 1000 caracteres")
        String descripcion,

        @NotBlank(message = "La duracion es obligatoria")
        @Size(max = 50, message = "La duracion no debe superar los 50 caracteres")
        String duracion,

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
        BigDecimal precio) {
}
