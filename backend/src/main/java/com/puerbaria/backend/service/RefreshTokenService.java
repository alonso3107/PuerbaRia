package com.puerbaria.backend.service;

import com.puerbaria.backend.exception.SesionInvalidaException;
import com.puerbaria.backend.model.RefreshToken;
import com.puerbaria.backend.model.User;
import com.puerbaria.backend.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

/**
 * Gestiona los refresh tokens persistidos en base de datos.
 * Cada renovacion rota el token: el anterior queda inservible,
 * y borrar la fila equivale a cerrar la sesion de verdad.
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final SecureRandom GENERADOR = new SecureRandom();

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpirationMs;

    public String crear(User user) {
        RefreshToken token = RefreshToken.builder()
                .token(generarValor())
                .user(user)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshExpirationMs / 1000))
                .createdAt(LocalDateTime.now())
                .build();

        return refreshTokenRepository.save(token).getToken();
    }

    @Transactional
    public RefreshToken rotar(String valor) {
        RefreshToken actual = refreshTokenRepository.findByToken(valor)
                .orElseThrow(() -> new SesionInvalidaException("La sesion no es valida. Inicie sesion de nuevo."));

        refreshTokenRepository.delete(actual);

        if (actual.estaVencido()) {
            throw new SesionInvalidaException("La sesion expiro. Inicie sesion de nuevo.");
        }

        RefreshToken nuevo = RefreshToken.builder()
                .token(generarValor())
                .user(actual.getUser())
                .expiresAt(LocalDateTime.now().plusSeconds(refreshExpirationMs / 1000))
                .createdAt(LocalDateTime.now())
                .build();

        return refreshTokenRepository.save(nuevo);
    }

    @Transactional
    public void revocar(String valor) {
        refreshTokenRepository.deleteByToken(valor);
    }

    private String generarValor() {
        byte[] bytes = new byte[32];
        GENERADOR.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
