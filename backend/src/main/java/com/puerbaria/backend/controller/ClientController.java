package com.puerbaria.backend.controller;

import com.puerbaria.backend.dto.VoucherAdminResponse;
import com.puerbaria.backend.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/client")
@RequiredArgsConstructor
public class ClientController {

    private final VoucherService voucherService;

    @GetMapping("/vouchers")
    public ResponseEntity<List<VoucherAdminResponse>> getMyVouchers(Authentication authentication) {
        return ResponseEntity.ok(voucherService.obtenerVouchersPorEmail(authentication.getName()));
    }
}
