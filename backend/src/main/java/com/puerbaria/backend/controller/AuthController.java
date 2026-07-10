package com.puerbaria.backend.controller;

import com.puerbaria.backend.dto.AuthResponse;
import com.puerbaria.backend.dto.LoginRequest;
import com.puerbaria.backend.dto.RegisterRequest;
import com.puerbaria.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador de Autenticación.
 * Expone los endpoints para que el frontend pueda registrarse e iniciar sesión.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") //      Permite peticiones desde el frontend Angular
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
