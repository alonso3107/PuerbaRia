package com.puerbaria.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class VoucherRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, message = "El nombre debe tener al menos 3 caracteres")
    private String nombre;

    @NotBlank(message = "La habitacion es obligatoria")
    private String habitacion;

    @NotBlank(message = "El tipo de comprobante es obligatorio")
    private String tipoComprobante;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal monto;

    @NotBlank(message = "El codigo de operacion es obligatorio")
    @Size(min = 6, message = "El codigo debe tener al menos 6 caracteres")
    private String codigoOperacion;

    @NotNull(message = "La fecha de pago es obligatoria")
    private LocalDate fechaPago;

    @NotBlank(message = "El celular es obligatorio")
    @Pattern(regexp = "^[0-9]{9}$", message = "El celular debe tener 9 digitos")
    private String celular;
}
