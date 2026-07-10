package com.puerbaria.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para mostrar vouchers dentro del dashboard administrativo.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherAdminResponse {

    private Long id;
    private String nombre;
    private String habitacion;
    private String tipoComprobante;
    private BigDecimal monto;
    private String codigoOperacion;
    private LocalDate fechaPago;
    private String celular;
    private String archivoNombre;
    private String archivoTipo;
    private String estado;
    private LocalDateTime fechaSubida;
    private String archivoUrl;
}
