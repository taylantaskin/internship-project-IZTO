package com.izto.firma_rehberi.service;

import  com.izto.firma_rehberi.dto.FirmaDto;
import com.izto.firma_rehberi.dto.FirmaSorguSonucDto;
import com.izto.firma_rehberi.entity.Firma;
import com .izto.firma_rehberi.entity.Ilce;
import com.izto.firma_rehberi.entity.MeslekGrubu;
import com.izto.firma_rehberi.repository.FirmaRepository;
import com.izto.firma_rehberi.repository.IlceRepository;
import com.izto.firma_rehberi.repository.MeslekGrubuRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java .util.ArrayList;

@Service
public class FirmaService {
    private final FirmaRepository firmaRepository;
    private final IlceRepository ilceRepository;
    private final MeslekGrubuRepository meslekGrubuRepository;

    public FirmaService (FirmaRepository firmaRepository, IlceRepository ilceRepository, MeslekGrubuRepository meslekGrubuRepository){
        this.firmaRepository = firmaRepository;
        this.ilceRepository = ilceRepository;
        this.meslekGrubuRepository = meslekGrubuRepository;
    }

    public FirmaSorguSonucDto sorgula (String unvani, String meslekGrubuAd, String ilceAd,String naceKodu, int sayfa, int sayfaBoyutu){

        Pageable pageable = PageRequest.of(sayfa-1, sayfaBoyutu);// // Frontend sayfaları 1'den başlatır ama Spring Boot Pagination (sayfalama) 0'dan başlar.


        //2.adımda yazdığımız JPQL filteleme metodunu çağırır, 
        Page<Firma> sonuc =firmaRepository.filtrele(unvani, meslekGrubuAd, ilceAd, naceKodu, pageable); // Page<Firma> sadece "firmaların listesi" değil. Listenin yanında pagination bilgilerini de taşıyan bir nesne.x

        //Sonuçları DTO'ya dönüştürmek için boş bir liste oluşturuyoruz
        List<FirmaDto> frontendListesi = new ArrayList<>();

        List<Firma> firmalar=sonuc.getContent();
        for (int i=0; i<firmalar.size(); i++){
            Firma hamFirma =firmalar.get(i);
            FirmaDto temizFirma =toDto(hamFirma);
            frontendListesi.add(temizFirma);
        }


        //(for-each)
        /*for (Firma hamFirma : sonuc.getContent()){
            FirmaDto temizFirma = toDto(hamFirma);
            frontendListesi.add(temizFirma);
        }
        
        List<FirmaDto> frontendListesi =
        sonuc.getContent()
             .stream()
             .map(this::toDto)
             .toList(); 
        yukardaki for ile aynı
        */

        long toplamFirmaSayisi = sonuc.getTotalElements();
        
        return new FirmaSorguSonucDto(
            toplamFirmaSayisi,
            sayfa,
            sayfaBoyutu,
            frontendListesi
        );
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
            f.getTescilliAdresi(),
            f.getWebAdresi(),
            meslek, ilce,nace
        );
    }
    public List<String> ilceleriGetir(){
            List<Ilce> ilceler=ilceRepository.findAll();
            List<String> sonuc = new ArrayList<>();
            for (Ilce x : ilceler){
                sonuc.add(x.getIlceAdi());
            }
            return sonuc;
    }
    // üstteki fonk ile aynı sadece stream ve map kullanarak daha kısa yazdık
    public List<String> meslekGrubuGetir(){
        return meslekGrubuRepository.findAll().stream().map(MeslekGrubu::getMeslekAdi).toList();
    }

}



