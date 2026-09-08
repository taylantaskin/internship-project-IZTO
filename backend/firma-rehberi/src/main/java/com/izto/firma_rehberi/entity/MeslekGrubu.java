package com.izto.firma_rehberi.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.izto.firma_rehberi.entity.Firma;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


@Data 
@Entity 
@Table(
    name ="meslek_gruplari"
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