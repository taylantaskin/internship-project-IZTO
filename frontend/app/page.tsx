"use client";

import { useState, useEffect } from "react";
import { getFirmalar, getIlceler, getMeslekGruplari, FirmaDto } from "../lib/api";

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

  // Sayfa ilk açıldığında dropdown listelerini bir kez çek
  useEffect(() => {
    getIlceler().then(setIlceler).catch(() => {});
    getMeslekGruplari().then(setMeslekGruplari).catch(() => {});
  }, []);

  const sorgulaYap = (hedefSayfa: number) => {
    setYukleniyor(true);
    setHata(null);
    
    // DÜZELTME: Backend'in beklediği parametre isimleriyle eşleştirildi
    getFirmalar({ 
      unvani: unvan, 
      meslekGrubuAd: meslekGrubu, 
      ilceAd: ilce, 
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

  const handleSorgula = () => {
    sorgulaYap(1); // yeni arama her zaman 1. sayfadan başlar
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#091424] text-gray-200' : 'bg-[#f4f7f9] text-gray-900'}`}>

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
                      {meslekGruplari.map((mg) => (
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
                      {ilceler.map((il) => (
                        <option key={il} value={il}>{il}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Butonlar ve Sayı Kartı */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pt-2">
                  <div className="flex-1 max-w-[300px]">
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nace Kodu</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="00" className={`w-1/3 text-center border rounded px-2 py-2 text-sm font-bold focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white placeholder-gray-600' : 'bg-white border-gray-300 text-black'}`} />
                      <input type="text" placeholder="00" className={`w-1/3 text-center border rounded px-2 py-2 text-sm font-bold focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white placeholder-gray-600' : 'bg-white border-gray-300 text-black'}`} />
                      <input type="text" placeholder="00" className={`w-1/3 text-center border rounded px-2 py-2 text-sm font-bold focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white placeholder-gray-600' : 'bg-white border-gray-300 text-black'}`} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button className="bg-[#00a8ff] hover:bg-[#0097e6] text-white font-bold py-2 px-6 rounded text-sm transition">
                      Nace Kodu Yardım
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