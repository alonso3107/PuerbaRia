package com.puerbaria.backend.dto;

import java.math.BigDecimal;

public record TratamientoSpaResponse(
        Long id,
        String icono,
        String nombre,
        String descripcion,
        String duracion,
        BigDecimal precio) {
}
