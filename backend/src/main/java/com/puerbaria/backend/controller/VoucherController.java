package com.puerbaria.backend.controller;

import com.puerbaria.backend.dto.VoucherCreatedResponse;
import com.puerbaria.backend.dto.VoucherRequest;
import com.puerbaria.backend.model.Voucher;
import com.puerbaria.backend.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VoucherCreatedResponse> subirVoucher(
            @Valid @ModelAttribute VoucherRequest request,
            @RequestParam("archivo") MultipartFile archivo) {
        Voucher voucher = voucherService.guardarVoucher(request, archivo);

        return ResponseEntity.status(HttpStatus.CREATED).body(new VoucherCreatedResponse(
                "Voucher recibido correctamente. Sera validado en un plazo maximo de 24 horas.",
                voucher.getId(),
                voucher.getEstado().name()));
    }
}
