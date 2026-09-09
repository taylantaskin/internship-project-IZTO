package com.izto.firma_rehberi.controller;

import com.izto.firma_rehberi.dto.FirmaSorguSonucDto;
import com.izto.firma_rehberi.service.FirmaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController 
@RequestMapping("/firmalar") //Bu controllerin tüm endpointleri /firmalar ile başlar
public class FirmaController {
    private final FirmaService firmaService;

    public FirmaController (FirmaService firmaService){
        this.firmaService = firmaService;
    }

    @GetMapping
    public FirmaSorguSonucDto firmaGetir(
        @RequestParam (required= false) String unvani,  //urlden gelen parametreleri yakalar ,kullanıcı göndermesse bile program çökmez null olarak alır 
        @RequestParam (required =false) String meslekGrubuAd,
        @RequestParam (required = false) String ilceAd,
        @RequestParam (defaultValue="1") int sayfa, // varsayılan olarak 1. sayfa ve 50 
        @RequestParam (defaultValue="50") int sayfaBoyutu
    ){
        return firmaService.sorgula(unvani, meslekGrubuAd, ilceAd, sayfa, sayfaBoyutu);
    }
}
