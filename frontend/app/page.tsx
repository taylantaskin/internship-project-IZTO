"use client";

import { useState, useEffect } from "react";
import { getFirmalar, getIlceler, getMeslekGruplari, FirmaDto ,getNaceKodlariByMeslek,NaceDto} from "../lib/api";
import * as XLSX from "xlsx";

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

  const [naceKodu1, setNace1]= useState("");
  const [naceKodu2, setNace2] = useState("");
  const [naceKodu3, setNace3] = useState("");

  const [uyari, setUyari] = useState<string | null> (null);

  const [naceYardimAcik, setNaceYardimAcik] = useState(false);
  const [naceListesi, setNaceListesi] = useState<NaceDto[]>([]);
  const [naceFiltreKod, setNaceFiltreKod] = useState("");
  const [naceFiltreAd, setNaceFiltreAd] = useState("");


  // Sayfa ilk açıldığında dropdown listelerini bir kez çek
  useEffect(
    () => {
    getIlceler().then(setIlceler).catch(
      () => {}
    );
    getMeslekGruplari().then(setMeslekGruplari).catch(
      () => {}
    );
  }, []);

  const handleSorgula = () => {

    const naceKoduTam = [naceKodu1,naceKodu2,naceKodu3].filter(Boolean).join(".");
    
    const birKriterSecildi= Boolean ( 
      unvan.trim() || (ilce && ilce!=="") || (meslekGrubu && meslekGrubu!=="") || naceKoduTam
    )
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
    
    const naceKoduTam = [naceKodu1,naceKodu2,naceKodu3].filter(Boolean).join(".");

    // DÜZELTME: Backend'in beklediği parametre isimleriyle eşleştirildi
    getFirmalar({ 
      unvani: unvan, 
      meslekGrubuAd: meslekGrubu, 
      ilceAd: ilce, 
      naceKodu:naceKoduTam  || undefined,
      sayfa: hedefSayfa 
    })
      .then((sonuc) => {
        setFirmalar(sonuc.veriler);
        setToplam(sonuc.toplam);
        setSayfa(sonuc.sayfa);
        setIsSearched(true);
      })
      .catch((err) => setHata(err.message))
      .finally(() => setYukleniyor(false));
    };
  //handleNaceYardim isimli bir fonksiyon oluştur.Bu fonksiyon parametre almıyor.Çağrılınca { } içindeki kodları çalıştır.
  const handleNaceYardim = async () => {
    if (!meslekGrubu || meslekGrubu === "Seçiniz") { //Meslek grubu boşsa VEYA Meslek grubu "Seçiniz" ise
      setUyari("Lütfen Meslek Grubunu Seçiniz!!!");
      setTimeout(() => setUyari(null), 4000);
      return;
    }
    setUyari(null);

    if(naceYardimAcik){
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
    setNace1(parcalar[0] || ""); //birinci ?? "" nullish coalecing operatör 
    setNace2(parcalar[1] || "");
    setNace3(parcalar[2] || "");
    setNaceYardimAcik(false); // Seçim yapınca paneli kapat
  };

  function handleExcelIndir (){

    const excelVerisi =[];
    for (let i =0; i < firmalar.length; i++){
      const firma =firmalar[i];
      
      const meslek =firma.meslekGrubuAd ?firma .meslekGrubuAd: "-"; // ternary operator
      const nace = firma.naceKoduAd ? firma.naceKoduAd : "-";  //const meslek = firma.meslekGrubuAd || "-";
      /*
        let meslek: string;
        if (firma.meslekGrubuAd) {
          meslek = firma.meslekGrubuAd;
        } else {
          meslek = "-";
        }
      */
      const ilce = firma.ilceAdi ? firma.ilceAdi : "-";
      const tescilliAdres = firma.tescilliAdresi ? firma.tescilliAdresi : "-";
      const web = firma.webAdresi ? firma.webAdresi : "-";

      // excelde görünecek sütun adları 
      excelVerisi.push({
        "oda sicil no": firma.odaSicilNo,
        "ticari sicil no": firma.ticariSicilNo,
        "ünvanı": firma.unvani,
        "meslek grubu": meslek,
        "nace kodu": nace,
        "ilçe": ilce,
        "tescilli adres": tescilliAdres,
        "web adresi": web
      });
    }

    if (excelVerisi.length===0){
      setUyari("indirilecek veri yok!!!");
      setTimeout(function(){
        setUyari(null);
      }, 4000);
      return;
    }
    /*
    funtiyon uyariyiKapat(){
      setUyari(null);
    }
    setTimeout(uyariyiKapat,4000);
    */


    // Elimizdeki düz (flat) JavaScript dizisini (JSON objelerinden oluşan excelVerisi listesini), Excel'in anlayabileceği "çalışma sayfası" (worksheet) formatına dönüştürür.
    const worksheet =XLSX.utils.json_to_sheet(excelVerisi);
    //Hafızada yepyeni, tamamen boş bir Excel çalışma kitabı (workbook) dosyası oluşturur.
    const workbook = XLSX.utils.book_new();
    //dolu çalışma sayfasını (worksheet), boş çalışma kitabının (workbook) içine yerleştirir.
    XLSX.utils.book_append_sheet(workbook,worksheet,"Firmalar");
    //Hafızada oluşturup içini doldurduğumuz çalışma kitabını, son kullanıcının bilgisayarına gerçek bir .xlsx (Excel) dosyası olarak kaydeder (indirmeyi başlatır).
    XLSX.writeFile(workbook, "IZTO_Firma_rehberi.xlsx")
  }

  

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#091424] text-gray-200' : 'bg-[#f4f7f9] text-gray-900'}`}>

      {uyari && (
        <div className="fixed top-6 right-6 z-50 bg-[#e67e22] text-white px-5 py-3 rounded shadow-lg flex items-center gap-3 animate-fade-in border border-orange-600">
          <div className="flex flex-col">
            <span className="font-bold text-xs">Bilgi</span>
            <span className="text-sm font-medium">{uyari}</span>
          </div>
          <button onClick={() => setUyari(null)} className="ml-4 text-white/80 hover:text-white text-lg font-bold leading-none">
            ×
          </button>
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

      {/* Üst Menü (Navbar) */}
      <header className={`h-16 flex items-center justify-between px-6 border-b shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#050a13] border-[#162947]' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1c3a70] flex items-center justify-center text-white text-xs font-bold border-2 border-[#1c3a70] shadow-sm">İZTO</div>
          <span className={`text-lg font-semibold tracking-wide ${isDarkMode ? 'text-white' : 'text-[#1c3a70]'}`}>İzmir Ticaret Odası</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-[#162947] text-yellow-400 hover:bg-[#1f375b]' : 'bg-orange-50 text-orange-400 hover:bg-orange-100'}`}
          >
            {isDarkMode ? (
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>
        </div>
      </header>

      <main className="flex-grow p-6 flex justify-center">
        <div className={`w-full max-w-[1400px] rounded-lg shadow-sm border flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0f1f38] border-[#162947]' : 'bg-white border-gray-200'}`}>

          {/* Başlık */}
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
            <div className={`border rounded-lg p-5 ${isDarkMode ? 'border-[#162947] bg-[#0c192d]' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-2 mb-6">
                <h2 className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Sorgu Kriterleri</h2>
              </div>

              <div className="space-y-4">
                {/* Oda Sicil No / İlçe Kodu / Ticaret Sicil No */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Oda Sicil No</label>
                    <input type="text" placeholder="0" className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white placeholder-gray-600' : 'bg-white border-gray-300 text-black'}`} />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>İlçe Kodu</label>
                    <input type="text" placeholder="00" className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white placeholder-gray-600' : 'bg-white border-gray-300 text-black'}`} />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ticaret Sicil No</label>
                    <input type="text" placeholder="0" className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white placeholder-gray-600' : 'bg-white border-gray-300 text-black'}`} />
                  </div>
                </div>

                {/* Ünvan */}
                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ünvan</label>
                  <input
                    type="text"
                    placeholder="Ünvan"
                    value={unvan}
                    onChange={(e) => setUnvan(e.target.value)}
                    className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white placeholder-gray-600' : 'bg-white border-gray-300 text-black'}`}
                  />
                </div>

                {/* Meslek Grubu / İlçe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Meslek Grubu</label>
                    <select
                      value={meslekGrubu}
                      onChange={(e) => setMeslekGrubu(e.target.value)}
                      className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 appearance-none ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-gray-300' : 'bg-white border-gray-300 text-gray-700'}`}
                    >
                      <option value="">Seçiniz</option>
                      {meslekGruplari.map((mg) => ( // Backend'deki Java Stream map ile aynı temel fikre sahip: bir koleksiyondaki elemanları başka bir forma dönüştürmek.
                        <option key={mg} value={mg}>{mg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>İlçe</label>
                    <select
                      value={ilce}
                      onChange={(e) => setIlce(e.target.value)}
                      className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 appearance-none ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-gray-300' : 'bg-white border-gray-300 text-gray-700'}`}
                    >
                      <option value="">Seçiniz</option>
                      {ilceler.map((il) => ( // JavaScript array ↓ map() HTML option'ları oluşturmak için kullanılır. Her ilçe için bir <option> elementi yaratılır.
                        <option key={il} value={il}>{il}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Butonlar ve Sayı Kartı */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pt-2">
                  {/* Nace Kodu Bölümü */}
                  <div className="flex-1 max-w-[300px]">
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Nace Kodu
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        maxLength={2}
                        placeholder="00" 
                        value={naceKodu1}
                        onChange={(e) => setNace1(e.target.value)}
                        className={`w-1/3 text-center border rounded px-2 py-2 text-sm font-bold focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white placeholder-gray-600' : 'bg-white border-gray-300 text-black'}`} 
                      />
                      <input 
                        type="text" 
                        maxLength={2}
                        placeholder="00" 
                        value={naceKodu2}
                        onChange={(e) => setNace2(e.target.value)}
                        className={`w-1/3 text-center border rounded px-2 py-2 text-sm font-bold focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white placeholder-gray-600' : 'bg-white border-gray-300 text-black'}`} 
                      />
                      <input 
                        type="text" 
                        maxLength={2}
                        placeholder="00" 
                        value={naceKodu3}
                        onChange={(e) => setNace3(e.target.value)}
                        className={`w-1/3 text-center border rounded px-2 py-2 text-sm font-bold focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white placeholder-gray-600' : 'bg-white border-gray-300 text-black'}`} 
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                    type="button"
                    onClick={handleNaceYardim}
                    className="bg-[#00a8ff] hover:bg-[#0097e6] text-white font-bold py-2 px-6 rounded text-sm transition">
                    {naceYardimAcik ? "Nace Kodu Yardım Kapat" : "Nace Kodu Yardım"}
                    </button>
                    <button onClick={handleSorgula} className="bg-[#4cd137] hover:bg-[#44bd32] text-white font-bold py-2 px-10 rounded text-sm transition">
                      Sorgula
                    </button>
                    <button className="bg-[#4cd137] hover:bg-[#44bd32] text-white font-bold py-2 px-6 rounded text-sm transition flex items-center gap-2">
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm60.1 106.5L222.4 341.6c-2.7 3-7.2 3-9.8 0l-16-17.7c-2.7-3-2.7-7.8 0-10.8l38.2-42.3h-100c-3.9 0-7-3.1-7-7v-20c0-3.9 3.1-7 7-7h100l-38.2-42.3c-2.7-3-2.7-7.8 0-10.8l16-17.7c2.7-3 7.2-3 9.8 0l61.7 68.3c3.1 3.5 3.1 9 0 12.4zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path></svg>
                      Excel
                    </button>

                      
                    {isSearched && !yukleniyor && (
                      <div className={`font-bold text-xs px-4 py-2.5 rounded ml-2 border ${isDarkMode ? 'bg-[#0f243b] text-[#5b95ff] border-[#1f375b]' : 'bg-[#e1f0fa] text-[#0056b3] border-[#b8daff]'}`}>
                        TOPLAM ÜYE FİRMA SAYISI : {toplam}
                      </div>
                    )}
                  </div>
                </div>

                {/* NACE KODU YARDIM PANELİ */}
                {naceYardimAcik && (
                  <div className={`mt-6 border rounded-lg p-4 transition-colors ${isDarkMode ? 'bg-[#0c192d] border-[#162947]' : 'bg-white border-gray-200'}`}>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-[#162947] mb-3">
                      <span className="text-xs font-bold flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
                        NACE Kodu Yardım
                      </span>
                      <span className="text-[11px] text-gray-500">Seçmek istediğiniz satıra tıklayınız.</span>
                    </div>

                    <div className="overflow-x-auto max-h-72 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className={`border-b ${isDarkMode ? 'border-[#1f375b] text-gray-300' : 'border-gray-200 text-gray-700'}`}>
                            <th className="p-2 w-28">
                              <div>Nace Kodu</div>
                              <input
                                type="text"
                                placeholder="Kod ara..."
                                value={naceFiltreKod}
                                onChange={(e) => setNaceFiltreKod(e.target.value)}
                                className={`w-full mt-1 p-1 rounded border text-[11px] font-normal ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white' : 'bg-gray-50 border-gray-300'}`}
                              />
                            </th>
                            <th className="p-2">
                              <div>Nace Adı</div>
                              <input
                                type="text"
                                placeholder="Nace adında ara..."
                                value={naceFiltreAd}
                                onChange={(e) => setNaceFiltreAd(e.target.value)}
                                className={`w-full mt-1 p-1 rounded border text-[11px] font-normal ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white' : 'bg-gray-50 border-gray-300'}`}
                              />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {naceListesi
                            .filter((item) =>
                              item.naceKodu?.toLowerCase().includes(naceFiltreKod.toLowerCase()) &&
                              item.naceAdi?.toLowerCase().includes(naceFiltreAd.toLowerCase())
                            )
                            .map((item) => (
                              <tr
                                key={item.id}
                                onClick={() => handleNaceSec(item.naceKodu)}
                                className={`border-b cursor-pointer transition ${isDarkMode ? 'border-[#162947] hover:bg-[#162947]' : 'border-gray-100 hover:bg-blue-50'}`}
                              >
                                <td className="p-2 font-bold text-blue-500 whitespace-nowrap">{item.naceKodu}</td>
                                <td className="p-2">{item.naceAdi}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sorgu Sonuçları */}
            <div className="mt-6">
              <div className={`flex items-center gap-2 mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"></path></svg>
                <h3 className="text-[13px] font-bold">Sorgu Sonuçları</h3>
              </div>
              <p className={`text-xs pl-6 mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Kayıtlar daha okunabilir kartlar halinde gösterilmektedir.</p>

              {yukleniyor && <p className="pl-6 text-sm">Yükleniyor...</p>}
              {hata && <p className="pl-6 text-sm text-red-500">Hata: {hata}</p>}

              {isSearched && !yukleniyor && !hata && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    {firmalar.map((firma) => (
                      <div key={firma.odaSicilNo} className={`border rounded-lg p-5 shadow-sm hover:shadow-md transition-all ${isDarkMode ? 'bg-[#0f1f38] border-[#1f375b]' : 'bg-white border-gray-200'}`}>

                        <div className="flex gap-3 mb-4 items-start">
                          <div className={`w-10 h-10 rounded flex-shrink-0 flex items-center justify-center ${isDarkMode ? 'bg-[#162947] text-[#5b95ff]' : 'bg-[#eef2f9] text-[#4a85f6]'}`}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M19 2H9c-1.103 0-2 .897-2 2v5.586l-4.707 4.707A1 1 0 0 0 2 15v6c0 1.103.897 2 2 2h15c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm-8 18H4v-4.586l3-3 4 4V20zm8 0h-6v-6.586l-2.293-2.293L12 9.828V4h7v16z"></path></svg>
                          </div>
                          <div>
                            <div className={`text-[10px] font-bold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Üye Firma</div>
                            <div className={`text-[13px] font-bold leading-tight mt-0.5 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{firma.unvani}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`border rounded px-2.5 py-1 text-[11px] ${isDarkMode ? 'border-[#1f375b] text-gray-300' : 'border-gray-200 text-gray-700'}`}>Oda Sicil: {firma.odaSicilNo}</span>
                          <span className={`border rounded px-2.5 py-1 text-[11px] ${isDarkMode ? 'border-[#1f375b] text-gray-300' : 'border-gray-200 text-gray-700'}`}>Ticaret Sicil: {firma.ticariSicilNo}</span>
                          <span className={`border rounded px-2.5 py-1 text-[11px] ${isDarkMode ? 'border-[#1f375b] text-gray-300' : 'border-gray-200 text-gray-700'}`}>İlçe: {firma.ilceAdi}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                          <div className={`border rounded p-3 ${isDarkMode ? 'bg-[#162947] border-[#1f375b]' : 'bg-gray-50 border-gray-100'}`}>
                            <div className={`text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Meslek Grubu</div>
                            <div className={`text-xs line-clamp-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{firma.meslekGrubuAd}</div>
                          </div>
                          <div className={`border rounded p-3 ${isDarkMode ? 'bg-[#162947] border-[#1f375b]' : 'bg-gray-50 border-gray-100'}`}>
                            <div className={`text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nace Kodu</div>
                            <div className={`text-xs line-clamp-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{firma.naceKoduAd}</div>
                          </div>
                        </div>

                        <div className={`border rounded p-3 ${isDarkMode ? 'bg-[#162947] border-[#1f375b]' : 'bg-gray-50 border-gray-100'}`}>
                          <div className={`text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tescilli Adres</div>
                          {/* DÜZELTME: tescilliAadresi -> tescilliAdresi */}
                          <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{firma.tescilliAdresi}</div>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Sayfalama */}
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