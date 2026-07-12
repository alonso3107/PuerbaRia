package com.puerbaria.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class FotoHabitacion {

    @Column(nullable = false)
    private String src;

    @Column(nullable = false)
    private String alt;
}
