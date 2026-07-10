package com.puerbaria.backend.controller;

import com.puerbaria.backend.dto.VoucherAdminResponse;
import com.puerbaria.backend.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controlador para las vistas del Cliente.
 */
@RestController
@RequestMapping("/api/v1/client")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    private final VoucherService voucherService;

    @GetMapping("/vouchers")
    public ResponseEntity<List<VoucherAdminResponse>> getMyVouchers() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(voucherService.obtenerVouchersPorEmail(email));
    }
}
