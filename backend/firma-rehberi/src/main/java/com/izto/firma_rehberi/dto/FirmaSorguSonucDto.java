package com.izto.firma_rehberi.dto;
import java.util.List;

public record FirmaSorguSonucDto(
    long toplam,
    int sayfa,
    int sayfaBoyutu,
    List <FirmaDto> veriler
) {}
