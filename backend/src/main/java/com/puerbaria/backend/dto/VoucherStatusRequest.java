package com.puerbaria.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para aprobar o rechazar vouchers desde administracion.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherStatusRequest {

    @NotBlank(message = "El estado es obligatorio")
    @Pattern(regexp = "VALIDADO|RECHAZADO", message = "El estado debe ser VALIDADO o RECHAZADO")
    private String estado;
}
