package com.izto.firma_rehberi.entity;

import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table (
    name="firmalar"
)
public class Firma {
    @Id 
    @Column(
        name="oda_sicil_no"
    )
    private Integer odaSicilNo;

    @Column(
        name="ticari_sicil_no"
    )
    private Integer ticariSicilNo;

    @Column(
        name="unvani"
    )
    private String unvani;

    @Column(
        name="tescilli_adresi"
    )
    private String tescilliAadresi;
    
    @Column(
        name="web_adresi"
    )
    private String webAdresi;
    @Column (
        name="dijital_varliklar"
    )
    private String dijitalVarliklar;

    //ilişkiler

    @ManyToOne
    @JoinColumn(
        name="ilce_id"
    )
    private Ilce ilce;

    @ManyToOne
    @JoinColumn(
        name="meslek_id"
    )
    private MeslekGrubu meslekGrubu;

    @ManyToOne 
    @JoinColumn(
        name="nace_id"
    )
    private NaceKodu naceKodu; 
    
}
