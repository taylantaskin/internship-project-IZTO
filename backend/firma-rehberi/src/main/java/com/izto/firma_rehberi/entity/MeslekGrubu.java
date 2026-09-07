package com.izto.firma_rehberi.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data 
@Entity 
@Table(
    name ="meslek_grupları"
)
public class MeslekGrubu {
    @Id 
    @Column (
        name="meslek_id"
    )
    private Integer meslekId;
    @Column (
        name="meslek_adi"
    )
    private String meslekAdi;
}