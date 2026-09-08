package com.izto.firma_rehberi.repository;

import com.izto.firma_rehberi.entity.Firma;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FirmaRepository extends JpaRepository<Firma, Integer> {
}