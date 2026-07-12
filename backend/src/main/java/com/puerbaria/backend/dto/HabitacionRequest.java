package com.puerbaria.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record HabitacionRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no debe superar los 100 caracteres")
        String nombre,

        @NotBlank(message = "La esencia es obligatoria")
        @Size(max = 150, message = "La esencia no debe superar los 150 caracteres")
        String esencia,

        @NotBlank(message = "La descripcion es obligatoria")
        @Size(max = 1000, message = "La descripcion no debe superar los 1000 caracteres")
        String descripcion,

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
        BigDecimal precio,

        @NotNull(message = "El tamano es obligatorio")
        @Min(value = 1, message = "El tamano debe ser mayor a 0")
        Integer tamano,

        @NotNull(message = "La capacidad es obligatoria")
        @Min(value = 1, message = "La capacidad debe ser mayor a 0")
        Integer capacidad,

        @NotBlank(message = "El tipo de cama es obligatorio")
        String cama,

        @NotBlank(message = "La vista es obligatoria")
        String vista,

        @NotBlank(message = "El campo ideal para es obligatorio")
        String idealPara,

        @NotEmpty(message = "Debe registrar al menos una amenidad")
        List<@NotBlank(message = "Las amenidades no pueden estar vacias") String> amenidades,

        @NotEmpty(message = "Debe registrar al menos una condicion")
        List<@NotBlank(message = "Las condiciones no pueden estar vacias") String> condiciones,

        @NotEmpty(message = "Debe registrar al menos una foto")
        List<@Valid FotoHabitacionDto> fotos) {
}
