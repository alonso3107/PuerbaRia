package com.puerbaria.backend.controller;

import com.puerbaria.backend.dto.PaqueteSpaRequest;
import com.puerbaria.backend.dto.PaqueteSpaResponse;
import com.puerbaria.backend.dto.TratamientoSpaRequest;
import com.puerbaria.backend.dto.TratamientoSpaResponse;
import com.puerbaria.backend.service.SpaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/spa")
@RequiredArgsConstructor
public class SpaController {

    private final SpaService spaService;

    @GetMapping("/tratamientos")
    public ResponseEntity<List<TratamientoSpaResponse>> listarTratamientos() {
        return ResponseEntity.ok(spaService.listarTratamientos());
    }

    @PostMapping("/tratamientos")
    public ResponseEntity<TratamientoSpaResponse> crearTratamiento(
            @Valid @RequestBody TratamientoSpaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(spaService.crearTratamiento(request));
    }

    @PutMapping("/tratamientos/{id}")
    public ResponseEntity<TratamientoSpaResponse> actualizarTratamiento(
            @PathVariable Long id,
            @Valid @RequestBody TratamientoSpaRequest request) {
        return ResponseEntity.ok(spaService.actualizarTratamiento(id, request));
    }

    @DeleteMapping("/tratamientos/{id}")
    public ResponseEntity<Void> eliminarTratamiento(@PathVariable Long id) {
        spaService.eliminarTratamiento(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/paquetes")
    public ResponseEntity<List<PaqueteSpaResponse>> listarPaquetes() {
        return ResponseEntity.ok(spaService.listarPaquetes());
    }

    @PostMapping("/paquetes")
    public ResponseEntity<PaqueteSpaResponse> crearPaquete(@Valid @RequestBody PaqueteSpaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(spaService.crearPaquete(request));
    }

    @PutMapping("/paquetes/{id}")
    public ResponseEntity<PaqueteSpaResponse> actualizarPaquete(
            @PathVariable Long id,
            @Valid @RequestBody PaqueteSpaRequest request) {
        return ResponseEntity.ok(spaService.actualizarPaquete(id, request));
    }

    @DeleteMapping("/paquetes/{id}")
    public ResponseEntity<Void> eliminarPaquete(@PathVariable Long id) {
        spaService.eliminarPaquete(id);
        return ResponseEntity.noContent().build();
    }
}
