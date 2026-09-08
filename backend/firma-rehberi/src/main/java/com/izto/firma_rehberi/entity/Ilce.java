package com.izto.firma_rehberi.entity;  //fully qualified class name
/*src
└── main
    └── java
        └── com
            └── izto
                └── firma_rehberi
                    └── entity
                        └── Ilce.java
*/

import jakarta.persistence.*;
import lombok.Data;

@Data // getter setter metodlarını otomatik üretir
@Entity // bu sııfın bir veritabı tablosu oldugunu belirtir
@Table(name="ilceler") // mysqldeki gerçek tablo adı
public class Ilce {
    @Id //Primary key 
    @Column ( 
        name="ilce_id"
    )
    private Integer ilceId;

    @Column (
        name="ilce_ad"
    )
    private String ilceAdi;
    
}
