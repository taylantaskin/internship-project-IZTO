package com.izto.firma_rehberi.repository;

import com.izto.firma_rehberi.entity.NaceKodu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.Query;
import org.springframework.data.repository.queryy.Param;

import java.util.List;

public interface NaceKoduRepository extends JpaRepository<NaceKodu, Short>{
    
    @Query("""
            SELECT DISTINCT
            """;)
}
