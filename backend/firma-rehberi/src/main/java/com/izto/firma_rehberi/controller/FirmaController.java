package com.izto.firma_rehberi.controller;

import com.izto.firma_rehberi.dto.FirmaSorguSonucDto;
import com.izto.firma_rehberi.service.FirmaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController  //HTTP üzerinden gelen isteği al, içindeki bilgileri çıkar ve uygun Service metodunu çağır
@RequestMapping("/firmalar") //Bu controllerin tüm endpointleri /firmalar ile başlar
public class FirmaController {
    private final FirmaService firmaService;

    public FirmaController (FirmaService firmaService){
        this.firmaService = firmaService;
    }

    @GetMapping // GET isteği geldiğinde bu metod karşılık verir. Örn: /firmalar?unvani=ABC&meslekGrubuAd=XYZ&ilceAd=123
    public FirmaSorguSonucDto firmaGetir(
        @RequestParam (required= false) String unvani,  //urlden gelen parametreleri yakalar ,kullanıcı göndermesse bile program çökmez null olarak alır 
        @RequestParam (required =false) String meslekGrubuAd,
        @RequestParam (required = false) String ilceAd,
        @RequestParam (defaultValue="1") int sayfa, // varsayılan olarak 1. sayfa ve 50 
        @RequestParam (defaultValue="50") int sayfaBoyutu
    ){
        FirmaSorguSonucDto sonuc = firmaService.sorgula( // firmaService sorgula metodunu çağırır ve gelen parametreleri ona iletir
            unvani,
            meslekGrubuAd,
            ilceAd,
            sayfa,
            sayfaBoyutu
        );
        return sonuc; // frontend'e gönderilecek sonuçları içeren DTO nesnesi
    }

    @GetMapping("/ilceler")
    public List<String> ilceleriGetir(){
        return firmaService.ilceleriGetir();
    }
    
    @GetMapping("/meslek-gruplari")
    public List<String> meslekGruplariniGetir(){
        return firmaService.meslekGrubuGetir();
    }
    

      
}
