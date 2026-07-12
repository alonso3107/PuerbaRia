package com.puerbaria.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Map;

@Component
public class GoogleTokenVerifier {

    private static final String URL_TOKENINFO = "https://oauth2.googleapis.com/tokeninfo?id_token={token}";

    private final RestClient restClient = RestClient.create();

    @Value("${google.client-id}")
    private String clientId;

    public record DatosGoogle(String email, String nombre) {
    }

    public DatosGoogle verificar(String credential) {
        if (clientId == null || clientId.isBlank()) {
            throw new IllegalArgumentException("El inicio de sesion con Google no esta configurado");
        }

        Map<String, Object> datos;
        try {
            datos = restClient.get()
                    .uri(URL_TOKENINFO, credential)
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {
                    });
        } catch (RestClientException e) {
            throw new IllegalArgumentException("No se pudo validar la cuenta de Google. Intente nuevamente.");
        }

        if (datos == null
                || !clientId.equals(datos.get("aud"))
                || !"true".equals(String.valueOf(datos.get("email_verified")))) {
            throw new IllegalArgumentException("No se pudo validar la cuenta de Google. Intente nuevamente.");
        }

        String email = String.valueOf(datos.get("email"));
        String nombre = datos.get("name") != null ? String.valueOf(datos.get("name")) : email;
        return new DatosGoogle(email, nombre);
    }
}
