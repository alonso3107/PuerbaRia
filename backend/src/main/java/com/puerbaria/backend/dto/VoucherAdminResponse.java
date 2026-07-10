package com.puerbaria.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record VoucherAdminResponse(
        Long id,
        String nombre,
        String habitacion,
        String tipoComprobante,
        BigDecimal monto,
        String codigoOperacion,
        LocalDate fechaPago,
        String celular,
        String archivoNombre,
        String archivoTipo,
        String estado,
        LocalDateTime fechaSubida,
        String archivoUrl
) {
}
