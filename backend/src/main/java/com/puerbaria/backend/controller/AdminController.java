package com.puerbaria.backend.controller;

import com.puerbaria.backend.dto.AdminUserResponse;
import com.puerbaria.backend.dto.VoucherAdminResponse;
import com.puerbaria.backend.dto.VoucherStatusRequest;
import com.puerbaria.backend.model.EstadoVoucher;
import com.puerbaria.backend.model.Voucher;
import com.puerbaria.backend.repository.UserRepository;
import com.puerbaria.backend.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
                .map(user -> new AdminUserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name()))
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
        EstadoVoucher estado = EstadoVoucher.valueOf(request.estado());
        return ResponseEntity.ok(voucherService.actualizarEstadoVoucher(id, estado));
    }

    @GetMapping("/vouchers/{id}/archivo")
    public ResponseEntity<Resource> getVoucherArchivo(@PathVariable Long id) {
        Voucher voucher = voucherService.obtenerVoucher(id);
        Resource recurso = voucherService.cargarArchivoVoucher(id);
        String tipoArchivo = voucherService.detectarTipoArchivo(voucher);
        String nombreArchivo = voucher.getArchivoNombre() != null
                ? voucher.getArchivoNombre()
                : "voucher-" + voucher.getId();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(tipoArchivo))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline().filename(nombreArchivo).build().toString())
                .body(recurso);
    }
}
