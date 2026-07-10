package com.puerbaria.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad Voucher — Comprobante de pago subido por el huesped.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vouchers")
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String habitacion;

    @Column(nullable = true)
    private String email;

    @Column(nullable = false)
    private String tipoComprobante;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(nullable = false, length = 20)
    private String codigoOperacion;

    @Column(nullable = false)
    private LocalDate fechaPago;

    @Column(nullable = false, length = 9)
    private String celular;

    @Column(nullable = false)
    private String archivoRuta;

    private String archivoNombre;

    private String archivoTipo;

    @Column(nullable = false)
    private String estado;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaSubida;

    @PrePersist
    protected void onCreate() {
        if (this.estado == null) {
            this.estado = "PENDIENTE";
        }
        this.fechaSubida = LocalDateTime.now();
    }
}
