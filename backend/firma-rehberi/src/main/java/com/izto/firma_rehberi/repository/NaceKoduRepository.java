package com.izto.firma_rehberi.repository;

import com.izto.firma_rehberi.entity.NaceKodu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NaceKoduRepository extends JpaRepository<NaceKodu,Short>{
    
    @Query("""
            SELECT DISTINCT f.naceKodu
            FROM Firma f 
            where f.meslekGrubu.meslekAdi = :meslekAdi
            AND f.naceKodu IS NOT NULL
            ORDER BY f.naceKodu.naceKodu ASC
            """
        )
        List<NaceKodu> findByMeslekGrubuAdi(
            @Param(
                "meslekAdi"
            ) 
            String meslekAdi
        );
}
