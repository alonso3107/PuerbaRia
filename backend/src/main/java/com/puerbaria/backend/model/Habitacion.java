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
@Table(name = "habitaciones")
public class Habitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nombre;

    @Column(nullable = false, length = 150)
    private String esencia;

    @Column(nullable = false, length = 1000)
    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(nullable = false)
    private Integer tamano;

    @Column(nullable = false)
    private Integer capacidad;

    @Column(nullable = false, length = 100)
    private String cama;

    @Column(nullable = false, length = 100)
    private String vista;

    @Column(name = "ideal_para", nullable = false)
    private String idealPara;

    @ElementCollection
    @CollectionTable(name = "habitacion_amenidades", joinColumns = @JoinColumn(name = "habitacion_id"))
    @OrderColumn(name = "posicion")
    @Column(name = "amenidad", nullable = false)
    @Builder.Default
    private List<String> amenidades = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "habitacion_condiciones", joinColumns = @JoinColumn(name = "habitacion_id"))
    @OrderColumn(name = "posicion")
    @Column(name = "condicion", nullable = false)
    @Builder.Default
    private List<String> condiciones = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "habitacion_fotos", joinColumns = @JoinColumn(name = "habitacion_id"))
    @OrderColumn(name = "posicion")
    @Builder.Default
    private List<FotoHabitacion> fotos = new ArrayList<>();
}
