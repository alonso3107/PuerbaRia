package com.puerbaria.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record PaqueteSpaResponse(
        Long id,
        String etiqueta,
        String nombre,
        String descripcion,
        String imagen,
        String duracion,
        BigDecimal precio,
        List<String> incluye) {
}
