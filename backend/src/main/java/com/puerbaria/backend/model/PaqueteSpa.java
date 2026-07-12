package com.puerbaria.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "paquetes_spa")
public class PaqueteSpa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String etiqueta;

    @Column(nullable = false, unique = true, length = 100)
    private String nombre;

    @Column(nullable = false, length = 1000)
    private String descripcion;

    @Column(nullable = false)
    private String imagen;

    @Column(nullable = false, length = 50)
    private String duracion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @ElementCollection
    @CollectionTable(name = "paquete_spa_incluye", joinColumns = @JoinColumn(name = "paquete_id"))
    @OrderColumn(name = "posicion")
    @Column(name = "detalle", nullable = false)
    @Builder.Default
    private List<String> incluye = new ArrayList<>();
}
