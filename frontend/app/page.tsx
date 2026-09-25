"use client";

import { useState, useEffect } from "react";
import { getFirmalar, getIlceler, getMeslekGruplari, FirmaDto, getNaceKodlariByMeslek, NaceDto } from "../lib/api";
import * as XLSX from "xlsx";

// Böldüğümüz Bağımsız Bileşenler
import Navbar from "../components/Navbar";
import FilterForm from "../components/FilterForm";
import NaceYardimPaneli from "../components/NaceYardimPaneli";
import FirmaKarti from "../components/FirmaKarti";

export default function Home() {
  const [isSearched, setIsSearched] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Filtre state'leri — inputları bunlara bağlayacağız
  const [unvan, setUnvan] = useState("");
  const [meslekGrubu, setMeslekGrubu] = useState("");
  const [ilce, setIlce] = useState("");

  // Dropdown seçenekleri, sayfa açılınca backend'den çekilecek
  const [ilceler, setIlceler] = useState<string[]>([]);
  const [meslekGruplari, setMeslekGruplari] = useState<string[]>([]);

  // Gerçek sorgu sonuçları
  const [firmalar, setFirmalar] = useState<FirmaDto[]>([]);
  const [toplam, setToplam] = useState(0);
  const [sayfa, setSayfa] = useState(1);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  const [naceKodu1, setNace1] = useState("");
  const [naceKodu2, setNace2] = useState("");
  const [naceKodu3, setNace3] = useState("");

  const [uyari, setUyari] = useState<string | null>(null);

  const [naceYardimAcik, setNaceYardimAcik] = useState(false);
  const [naceListesi, setNaceListesi] = useState<NaceDto[]>([]);
  const [naceFiltreKod, setNaceFiltreKod] = useState("");
  const [naceFiltreAd, setNaceFiltreAd] = useState("");

  // Sayfa ilk açıldığında dropdown listelerini bir kez çek
  useEffect(() => {
    getIlceler().then(setIlceler).catch(() => {});
    getMeslekGruplari().then(setMeslekGruplari).catch(() => {});
  }, []);

  const handleSorgula = () => {
    const naceKoduTam = [naceKodu1, naceKodu2, naceKodu3].filter(Boolean).join(".");
    
    const birKriterSecildi = Boolean(
      unvan.trim() || (ilce && ilce !== "") || (meslekGrubu && meslekGrubu !== "") || naceKoduTam
    );
    
    if (!birKriterSecildi) {
      setUyari("Lütfen Kriter Seçiniz!!!");
      setTimeout(() => setUyari(null), 4000);
      return;
    }
    setUyari(null);
    sorgulaYap(1);
  };

  const sorgulaYap = (hedefSayfa: number) => {
    setYukleniyor(true);
    setHata(null);
    
    const naceKoduTam = [naceKodu1, naceKodu2, naceKodu3].filter(Boolean).join(".");

    // DÜZELTME: Backend'in beklediği parametre isimleriyle eşleştirildi
    getFirmalar({ 
      unvani: unvan, 
      meslekGrubuAd: meslekGrubu, 
      ilceAd: ilce, 
      naceKodu: naceKoduTam || undefined,
      sayfa: hedefSayfa 
    })
      .then((sonuc) => {
        setFirmalar(sonuc.veriler);
        setToplam(sonuc.toplam);
        setSayfa(sonuc.sayfa);
        setIsSearched(true);
      })
      .catch((err) => setHata(err.message)) // .catch() aslında "bu async işlem başarısız olursa ne yapacağım?" kısmıdır.
      .finally(() =>{
        setTimeout(() => setYukleniyor(false), 1000);})
  };

  // handleNaceYardim isimli bir fonksiyon oluştur. Bu fonksiyon parametre almıyor. Çağrılınca { } içindeki kodları çalıştır.
  const handleNaceYardim = async () => {
    if (!meslekGrubu || meslekGrubu === "Seçiniz") { // Meslek grubu boşsa VEYA Meslek grubu "Seçiniz" ise
      setUyari("Lütfen Meslek Grubunu Seçiniz!!!");
      setTimeout(() => setUyari(null), 4000);
      return;
    }
    setUyari(null);

    if (naceYardimAcik) {
      setNaceYardimAcik(false);
      return;
    }
    try {
      setYukleniyor(true);
      const data = await getNaceKodlariByMeslek(meslekGrubu);
      setNaceListesi(data);
      setNaceYardimAcik(true);
    } catch (err: unknown) {
      setUyari(err instanceof Error ? err.message : "Nace kodları yüklenemedi");
      setTimeout(() => setUyari(null), 4000);
    } finally {
      setYukleniyor(false);
    }
  };

  const handleNaceSec = (kod: string) => {
    // "10.71.01" -> ["10", "71", "01"]
    const parcalar = kod.split(".");
    setNace1(parcalar[0] || ""); // birinci ?? "" nullish coalescing operatör
    setNace2(parcalar[1] || "");
    setNace3(parcalar[2] || "");
    setNaceYardimAcik(false); // Seçim yapınca paneli kapat
  };

  function handleExcelIndir() {
    const excelVerisi = [];
    for (let i = 0; i < firmalar.length; i++) {
      const firma = firmalar[i];
      
      const meslek = firma.meslekGrubuAd ? firma.meslekGrubuAd : "-"; // ternary operator
      const nace = firma.naceKoduAd ? firma.naceKoduAd : "-";  
      const ilce = firma.ilceAdi ? firma.ilceAdi : "-";
      const tescilliAdres = firma.tescilliAdresi ? firma.tescilliAdresi : "-";
      const web = firma.webAdresi ? firma.webAdresi : "-";

      // excelde görünecek sütun adları 
      excelVerisi.push({
        "Oda Sicil No": firma.odaSicilNo,
        "Ticaret Sicil No": firma.ticariSicilNo,
        "Ünvanı": firma.unvani,
        "Meslek Grubu": meslek,
        "Nace Kodu": nace,
        "İlçe": ilce,
        "Tescilli Adres": tescilliAdres,
        "Web Adresi": web
      });
    }

    if (excelVerisi.length === 0) {
      setUyari("İndirilecek veri yok!!!");
      setTimeout(() => setUyari(null), 4000);
      return;
    }
    
    // Elimizdeki düz (flat) JavaScript dizisini (JSON objelerinden oluşan excelVerisi listesini), Excel'in anlayabileceği "çalışma sayfası" (worksheet) formatına dönüştürür.
    const worksheet = XLSX.utils.json_to_sheet(excelVerisi);
    
    // Hafızada yepyeni, tamamen boş bir Excel çalışma kitabı (workbook) dosyası oluşturur.
    const workbook = XLSX.utils.book_new();
    
    // Dolu çalışma sayfasını (worksheet), boş çalışma kitabının (workbook) içine yerleştirir.
    XLSX.utils.book_append_sheet(workbook, worksheet, "Firmalar");
    
    // Hafızada oluşturup içini doldurduğumuz çalışma kitabını, son kullanıcının bilgisayarına gerçek bir .xlsx (Excel) dosyası olarak kaydeder (indirmeyi başlatır).
    XLSX.writeFile(workbook, "IZTO_Firma_Rehberi.xlsx");
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#091424] text-gray-200' : 'bg-[#f4f7f9] text-gray-900'}`}>

      {uyari && (
        <div className="fixed top-6 right-6 z-50 bg-[#e67e22] text-white px-5 py-3 rounded shadow-lg flex items-center gap-3 animate-fade-in border border-orange-600">
          <div className="flex flex-col">
            <span className="font-bold text-xs">Bilgi</span>
            <span className="text-sm font-medium">{uyari}</span>
          </div>
          <button onClick={() => setUyari(null)} className="ml-4 text-white/80 hover:text-white text-lg font-bold leading-none">×</button>
        </div>
      )}

      {yukleniyor && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center">
          <div className="bg-white/90 dark:bg-[#0f1f38]/90 p-6 rounded-xl shadow-2xl flex flex-col items-center gap-3 border border-gray-200 dark:border-[#1f375b]">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
              Lütfen Bekleyiniz...
            </span>
          </div>
        </div>
      )}

      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main className="flex-grow p-6 flex justify-center">
        <div className={`w-full max-w-[1400px] rounded-lg shadow-sm border flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0f1f38] border-[#162947]' : 'bg-white border-gray-200'}`}>

          <div className={`flex items-center gap-4 p-6 border-b ${isDarkMode ? 'border-[#162947]' : 'border-gray-100'}`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-[#162947] text-[#5b95ff]' : 'bg-[#eef2f9] text-[#4a85f6]'}`}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg"><path d="M19 2H9c-1.103 0-2 .897-2 2v5.586l-4.707 4.707A1 1 0 0 0 2 15v6c0 1.103.897 2 2 2h15c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm-8 18H4v-4.586l3-3 4 4V20zm8 0h-6v-6.586l-2.293-2.293L12 9.828V4h7v16z"></path></svg>
            </div>
            <div>
              <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Üye Firma Sorgulama</h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Firma bilgilerine ulaşmak için aşağıdaki kriterlerden bir veya birkaçını kullanabilirsiniz.</p>
            </div>
          </div>

          <div className="p-6">
            
            <FilterForm
              isDarkMode={isDarkMode}
              unvan={unvan} setUnvan={setUnvan}
              meslekGrubu={meslekGrubu} setMeslekGrubu={setMeslekGrubu} meslekGruplari={meslekGruplari}
              ilce={ilce} setIlce={setIlce} ilceler={ilceler}
              naceKodu1={naceKodu1} setNace1={setNace1}
              naceKodu2={naceKodu2} setNace2={setNace2}
              naceKodu3={naceKodu3} setNace3={setNace3}
              handleSorgula={handleSorgula}
              handleNaceYardim={handleNaceYardim}
              handleExcelIndir={handleExcelIndir}
              naceYardimAcik={naceYardimAcik}
              firmalarLength={firmalar.length}
              yukleniyor={yukleniyor}
              isSearched={isSearched}
              toplam={toplam}
            />

            <NaceYardimPaneli
              isDarkMode={isDarkMode}
              naceYardimAcik={naceYardimAcik}
              naceFiltreKod={naceFiltreKod} setNaceFiltreKod={setNaceFiltreKod}
              naceFiltreAd={naceFiltreAd} setNaceFiltreAd={setNaceFiltreAd}
              naceListesi={naceListesi}
              handleNaceSec={handleNaceSec}
            />

            <div className="mt-6">
              <div className={`flex items-center gap-2 mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"></path></svg>
                <h3 className="text-[13px] font-bold">Sorgu Sonuçları</h3>
              </div>
              <p className={`text-xs pl-6 mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Kayıtlar daha okunabilir kartlar halinde gösterilmektedir.</p>

              {hata && <p className="pl-6 text-sm text-red-500">Hata: {hata}</p>}

              {isSearched && !hata && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    {firmalar.map((firma) => (
                      <FirmaKarti 
                        key={firma.odaSicilNo} 
                        firma={firma} 
                        isDarkMode={isDarkMode} 
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-6 pb-2">
                    <button
                      disabled={sayfa === 1}
                      onClick={() => sorgulaYap(sayfa - 1)}
                      className="px-4 py-1.5 rounded border text-sm disabled:opacity-40"
                    >
                      Önceki
                    </button>
                    <span className="text-sm">Sayfa {sayfa} — Toplam {toplam} sonuç</span>
                    <button
                      disabled={sayfa * 50 >= toplam}
                      onClick={() => sorgulaYap(sayfa + 1)}
                      className="px-4 py-1.5 rounded border text-sm disabled:opacity-40"
                    >
                      Sonraki
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}