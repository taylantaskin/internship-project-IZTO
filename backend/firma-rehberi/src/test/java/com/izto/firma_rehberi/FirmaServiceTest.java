package com.izto.firma_rehberi;

import com.izto.firma_rehberi.entity.Firma;
import com.izto.firma_rehberi.repository.FirmaRepository;
import com.izto.firma_rehberi.repository.IlceRepository;
import com.izto.firma_rehberi.repository.MeslekGrubuRepository;
import com.izto.firma_rehberi.service.FirmaService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FirmaServiceTest {
    //mocklar
    @Mock
    private FirmaRepository firmaRepository;
    @Mock
    private IlceRepository ilceRepository;
    @Mock private MeslekGrubuRepository meslekGrubuRepository;

    @InjectMocks private FirmaService firmaService;

    @Test 
    void TumSonuclar(){
        Firma ornekFirma = new Firma();
        ornekFirma.setOdaSicilNo(1);
        ornekFirma.setUnvani("ornek firma");

        Pageable pageable = PageRequest.of(0, 50);
        Page<Firma> sahteSayfa = new PageImpl<Firma>(List.of(ornekFirma), pageable, 1);

        when(firmaRepository.filtrele(any(), any(), any(), any())).thenReturn(sahteSayfa);

        // çalıştırma
        var sonuc = firmaService.sorgula(null, null, null, 1, 50);

        //doğrula

        assertEquals(1,sonuc.toplam());
        assertEquals("ornek firma", sonuc.veriler().get(0).unvani());
    }   

    @Test
    void BosListe(){
        Pageable pageable = PageRequest.of(0,50);// Frontend sayfaları 1'den başlatır ama Spring Boot Pagination (sayfalama) 0'dan başlar
        Page<Firma> bosSayfa = new PageImpl<>(List.of(), pageable, 0);//Spring'in hazır sınıfını kullanarak boş bir sayfa oluşturuyoruz.

        when(firmaRepository.filtrele(any(), any(), any(), any())).thenReturn(bosSayfa);

        //çalıştırma

        var sonuc = firmaService.sorgula("HOGWARTS", null, null, 1, 50);

        assertEquals(0, sonuc.toplam());
        assertEquals(0, sonuc.veriler().size());
    }
 
}