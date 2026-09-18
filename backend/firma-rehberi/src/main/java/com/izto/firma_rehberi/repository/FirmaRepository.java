package com.izto.firma_rehberi.repository;

import com.izto.firma_rehberi.entity.Firma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface FirmaRepository extends JpaRepository<Firma, Integer> { // firma tablosunda çalışacağım pk de integer tipinde. JpaRepository<Firma, Integer> ile firma tablosu için CRUD işlemlerini yapabiliyoruz
    //Firma Entity'sini sorguya dahil et ve ona f isimli kısa bir referans ver.
    @Query ("""
        SELECT f FROM Firma f  
        where
         (:unvani IS NULL OR f.unvani LIKE CONCAT ('%', :unvani, '%'))
        AND 
        (:meslekGrubuAd IS NULL OR f.meslekGrubu.meslekAdi LIKE CONCAT ('%', :meslekGrubuAd, '%'))
        AND
         (:ilceAd IS NULL OR f.ilce.ilceAdi LIKE CONCAT ('%', :ilceAd, '%'))
        AND (:naceKodu IS NULL OR f.naceKodu.naceKodu LIKE CONCAT ('%', :naceKodu, '%'))
        """)
//%ABC% ;Bu da ünvan içerisinde herhangi bir yerde ABC geçen firmaları bulur.

    Page<Firma> filtrele( //Sonuçların tamamını List<Firma> olarak verme; bunları sayfalandırılmış şekilde getir.
    //Firma nesnelerini taşıyan bir Page döndüren filtrele metodu
        @Param("unvani")
         String unvani,
        @Param("meslekGrubuAd")
         String meslekGrubuAd,
        @Param("ilceAd")
         String ilceAd,
        @Param ("naceKodu")
         String naceKodu,
        Pageable pageable //Sayfalama bilgisi, sayfa numarası ve sayfa boyutu gibi bilgileri içerir.

    );
}