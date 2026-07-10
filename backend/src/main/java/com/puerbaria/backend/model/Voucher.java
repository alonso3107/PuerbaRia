package com.puerbaria.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoVoucher estado;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaSubida;

    @PrePersist
    void onCreate() {
        if (estado == null) {
            estado = EstadoVoucher.PENDIENTE;
        }
        fechaSubida = LocalDateTime.now();
    }
}
