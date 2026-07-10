package com.puerbaria.backend.controller;

import com.puerbaria.backend.dto.VoucherRequest;
import com.puerbaria.backend.model.Voucher;
import com.puerbaria.backend.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Controlador REST para la subida de vouchers.
 * Endpoint publico: los huespedes no necesitan autenticacion para subir su comprobante.
 */
@RestController
@RequestMapping("/api/v1/vouchers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class VoucherController {

    private final VoucherService voucherService;

    /**
     * POST /api/v1/vouchers
     * Recibe el formulario de voucher como multipart/form-data.
     * 
     * Campos esperados:
     * - nombre, habitacion, tipoComprobante, monto, codigoOperacion, fechaPago, celular
     * - archivo: MultipartFile con la imagen/PDF del comprobante
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> subirVoucher(
            @Valid @ModelAttribute VoucherRequest request,
            @RequestParam("archivo") MultipartFile archivo) {

        try {
            Voucher voucher = voucherService.guardarVoucher(request, archivo);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "mensaje", "Voucher recibido correctamente. Sera validado en un plazo maximo de 24 horas.",
                    "id", voucher.getId(),
                    "estado", voucher.getEstado()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al guardar el archivo. Intente nuevamente."));
        }
    }
}
