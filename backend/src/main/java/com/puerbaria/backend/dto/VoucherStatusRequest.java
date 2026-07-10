package com.puerbaria.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VoucherStatusRequest(
        @NotBlank(message = "El estado es obligatorio")
        @Pattern(regexp = "VALIDADO|RECHAZADO", message = "El estado debe ser VALIDADO o RECHAZADO")
        String estado
) {
}
