package com.puerbaria.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Limita los intentos por IP contra los endpoints de autenticacion para
 * frenar ataques de fuerza bruta. Ventana fija de un minuto; al exceder
 * el limite responde 429 sin tocar la base de datos.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int LIMITE_POR_MINUTO = 10;
    private static final long VENTANA_MS = 60_000;

    private final Map<String, Ventana> intentosPorIp = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equals(request.getMethod())
                || !request.getRequestURI().startsWith("/api/v1/auth/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        long ahora = System.currentTimeMillis();
        intentosPorIp.values().removeIf(ventana -> ahora - ventana.inicio >= VENTANA_MS);

        Ventana ventana = intentosPorIp.compute(obtenerIpCliente(request), (ip, actual) ->
                actual == null || ahora - actual.inicio >= VENTANA_MS ? new Ventana(ahora) : actual);

        if (ventana.intentos.incrementAndGet() > LIMITE_POR_MINUTO) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"error\":\"Demasiados intentos. Espere un minuto y vuelva a intentarlo.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    /** Detras de Caddy la IP real del cliente llega en X-Forwarded-For. */
    private String obtenerIpCliente(HttpServletRequest request) {
        String reenviada = request.getHeader("X-Forwarded-For");
        if (reenviada != null && !reenviada.isBlank()) {
            return reenviada.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private record Ventana(long inicio, AtomicInteger intentos) {
        Ventana(long inicio) {
            this(inicio, new AtomicInteger());
        }
    }
}
