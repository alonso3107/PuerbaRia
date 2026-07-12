package com.puerbaria.backend.dto;

public record AuthResponse(String token, String refreshToken, String name, String email, String role) {
}
