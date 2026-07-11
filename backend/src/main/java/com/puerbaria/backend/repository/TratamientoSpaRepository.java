package com.puerbaria.backend.repository;

import com.puerbaria.backend.model.TratamientoSpa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TratamientoSpaRepository extends JpaRepository<TratamientoSpa, Long> {

    List<TratamientoSpa> findAllByOrderByIdAsc();

    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);
}
