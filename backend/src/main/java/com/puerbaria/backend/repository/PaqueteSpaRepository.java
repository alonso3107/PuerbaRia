package com.puerbaria.backend.repository;

import com.puerbaria.backend.model.PaqueteSpa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaqueteSpaRepository extends JpaRepository<PaqueteSpa, Long> {

    List<PaqueteSpa> findAllByOrderByIdAsc();

    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);
}
