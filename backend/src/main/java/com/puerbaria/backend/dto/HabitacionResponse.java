package com.puerbaria.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record HabitacionResponse(
        Long id,
        String nombre,
        String esencia,
        String descripcion,
        BigDecimal precio,
        Integer tamano,
        Integer capacidad,
        String cama,
        String vista,
        String idealPara,
        List<String> amenidades,
        List<String> condiciones,
        List<FotoHabitacionDto> fotos) {
}
