package com.puerbaria.backend.repository;

import com.puerbaria.backend.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoucherRepository extends JpaRepository<Voucher, Long> {

    List<Voucher> findByEmailOrderByFechaSubidaDesc(String email);

    List<Voucher> findAllByOrderByFechaSubidaDesc();
}
