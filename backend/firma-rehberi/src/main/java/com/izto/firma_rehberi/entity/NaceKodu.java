package com.izto.firma_rehberi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data 
@Entity 
@Table(
    name="nace_kodlari"
)

public class NaceKodu {

    @Id 
    @Column(
        name="id"
    )
    private Integer id;

    @Column(
        name="nace_kodu",
        length=20
    )
    private String naceKodu;  
    
    @Column (
        name="nace_adi",
        length=500
    )
    private String naceAdi;
}
