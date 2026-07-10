package com.puerbaria.backend.backend.controller;

import com.puerbaria.backend.backend.dto.AdminUserResponse;
import com.puerbaria.backend.backend.dto.VoucherAdminResponse;
import com.puerbaria.backend.backend.dto.VoucherStatusRequest;
import com.puerbaria.backend.backend.model.Voucher;
import com.puerbaria.backend.backend.repository.UserRepository;
import com.puerbaria.backend.backend.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final VoucherService voucherService;

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getUsers() {
        List<AdminUserResponse> users = userRepository.findAll()
                .stream()
                .map(user -> AdminUserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .build())
                .toList();

        return ResponseEntity.ok(users);
    }

    @GetMapping("/vouchers")
    public ResponseEntity<List<VoucherAdminResponse>> getVouchers() {
        return ResponseEntity.ok(voucherService.listarVouchersAdmin());
    }

    @PatchMapping("/vouchers/{id}/estado")
    public ResponseEntity<VoucherAdminResponse> actualizarEstadoVoucher(
            @PathVariable Long id,
            @Valid @RequestBody VoucherStatusRequest request) {
        return ResponseEntity.ok(voucherService.actualizarEstadoVoucher(id, request.getEstado()));
    }

    @GetMapping("/vouchers/{id}/archivo")
    public ResponseEntity<Resource> getVoucherArchivo(@PathVariable Long id) throws IOException {
        try {
            Voucher voucher = voucherService.obtenerVoucher(id);
            Resource recurso = voucherService.cargarArchivoVoucher(id);
            String tipoArchivo = voucherService.detectarTipoArchivo(voucher);
            String nombreArchivo = voucher.getArchivoNombre() != null
                    ? voucher.getArchivoNombre()
                    : "voucher-" + voucher.getId();

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(tipoArchivo))
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            ContentDisposition.inline()
                                    .filename(nombreArchivo)
                                    .build()
                                    .toString()
                    )
                    .body(recurso);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }
}
