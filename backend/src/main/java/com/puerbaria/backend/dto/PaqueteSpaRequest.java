package com.puerbaria.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record PaqueteSpaRequest(
        @NotBlank(message = "La etiqueta es obligatoria")
        @Size(max = 100, message = "La etiqueta no debe superar los 100 caracteres")
        String etiqueta,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no debe superar los 100 caracteres")
        String nombre,

        @NotBlank(message = "La descripcion es obligatoria")
        @Size(max = 1000, message = "La descripcion no debe superar los 1000 caracteres")
        String descripcion,

        @NotBlank(message = "La imagen es obligatoria")
        String imagen,

        @NotBlank(message = "La duracion es obligatoria")
        @Size(max = 50, message = "La duracion no debe superar los 50 caracteres")
        String duracion,

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
        BigDecimal precio,

        @NotEmpty(message = "Debe registrar al menos un detalle incluido")
        List<@NotBlank(message = "Los detalles incluidos no pueden estar vacios") String> incluye) {
}
