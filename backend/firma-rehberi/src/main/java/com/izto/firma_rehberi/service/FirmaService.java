package com.izto.firma_rehberi.service;

import  com.izto.firma_rehberi.dto.FirmaDto;
import com.izto.firma_rehberi.dto.FirmaSorguSonucDto;
import com.izto.firma_rehberi.entity.Firma;
import com.izto.firma_rehberi.repository.FirmaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java .util.ArrayList;

@Service
public class FirmaService {
    private final FirmaRepository firmaRepository;

    public FirmaService (FirmaRepository firmaRepository){
        this.firmaRepository = firmaRepository;
    }

    public FirmaSorguSonucDto sorgula (String unvani, String meslekGrubuAd, String ilceAd, int sayfa, int sayfaBoyutu){

        Pageable pageable = PageRequest.of(sayfa-1, sayfaBoyutu);// // Frontend sayfaları 1'den başlatır ama Spring Boot Pagination (sayfalama) 0'dan başlar.


        //2.adımda yazdığımız JPQL filteleme etodunu çağırır, 
        Page<Firma> sonuc =firmaRepository.filtrele(unvani, meslekGrubuAd, ilceAd, pageable);

        //Sonuçları DTO'ya dönüştürmek için boş bir liste oluşturuyoruz
        List<FirmaDto> frontendListesi = new ArrayList<>();

        for (Firma hamFirma : sonuc.getContent()){
            FirmaDto temizFirma = toDto(hamFirma);
            frontendListesi.add(temizFirma);
        }

        long toplamFirmaSayisi = sonuc.getTotalElements();
        
        return new FirmaSorguSonucDto(toplamFirmaSayisi, sayfa, sayfaBoyutu, frontendListesi);
    }

    private FirmaDto toDto (Firma f){
        String meslek =null;
        String ilce= null;
        String nace= null;

        if (f.getMeslekGrubu() !=null){
            meslek = f.getMeslekGrubu().getMeslekAdi();
        }
        if (f.getIlce() !=null){
            ilce =f.getIlce().getIlceAdi();
        }
        if (f.getNaceKodu() !=null){
            nace =f.getNaceKodu().getNaceAdi();
        }

        return new FirmaDto(
            f.getOdaSicilNo(),
            f.getTicariSicilNo(),
            f.getUnvani(),
            f.getTescilliAadresi(),
            f.getWebAdresi(),
            meslek, ilce,nace
        );


    }
}



