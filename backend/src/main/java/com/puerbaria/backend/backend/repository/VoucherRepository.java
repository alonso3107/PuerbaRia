package com.puerbaria.backend.backend.repository;

import com.puerbaria.backend.backend.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para la entidad Voucher.
 * Metodos de consulta personalizados para el panel de administracion.
 */
@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {

    /** Buscar vouchers por estado (PENDIENTE, VALIDADO, RECHAZADO) */
    List<Voucher> findByEstado(String estado);

    /** Buscar por numero de celular */
    List<Voucher> findByCelular(String celular);

    /** Buscar vouchers por email ordenados por fecha */
    List<Voucher> findByEmailOrderByFechaSubidaDesc(String email);

    /** Contar vouchers pendientes de revision */
    long countByEstado(String estado);

    /** Listar vouchers recientes primero para el dashboard administrativo */
    List<Voucher> findAllByOrderByFechaSubidaDesc();
}
