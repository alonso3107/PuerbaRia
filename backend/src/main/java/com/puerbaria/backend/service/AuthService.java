package com.puerbaria.backend.service;

import com.puerbaria.backend.dto.AuthResponse;
import com.puerbaria.backend.dto.LoginRequest;
import com.puerbaria.backend.dto.RegisterRequest;
import com.puerbaria.backend.exception.RecursoNoEncontradoException;
import com.puerbaria.backend.model.RefreshToken;
import com.puerbaria.backend.model.Role;
import com.puerbaria.backend.model.User;
import com.puerbaria.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final GoogleTokenVerifier googleTokenVerifier;
    private final RefreshTokenService refreshTokenService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("El correo ya esta registrado");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build();

        userRepository.save(user);
        return construirRespuesta(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

        return construirRespuesta(user);
    }

    public AuthResponse loginConGoogle(String credential) {
        GoogleTokenVerifier.DatosGoogle datos = googleTokenVerifier.verificar(credential);

        User user = userRepository.findByEmail(datos.email())
                .orElseGet(() -> registrarDesdeGoogle(datos));

        return construirRespuesta(user);
    }

    // Transaccional para poder leer el usuario (LAZY) del token rotado
    @Transactional
    public AuthResponse refrescar(String refreshToken) {
        RefreshToken renovado = refreshTokenService.rotar(refreshToken);
        User user = renovado.getUser();
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, renovado.getToken(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public void cerrarSesion(String refreshToken) {
        refreshTokenService.revocar(refreshToken);
    }

    private User registrarDesdeGoogle(GoogleTokenVerifier.DatosGoogle datos) {
        User user = User.builder()
                .name(datos.nombre())
                .email(datos.email())
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .role(Role.USER)
                .build();

        return userRepository.save(user);
    }

    private AuthResponse construirRespuesta(User user) {
        String token = jwtService.generateToken(user);
        String refreshToken = refreshTokenService.crear(user);
        return new AuthResponse(token, refreshToken, user.getName(), user.getEmail(), user.getRole().name());
    }
}
