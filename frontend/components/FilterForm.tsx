import React from 'react';

// Form bileşeninin dışarıdan alacağı (page.tsx'ten gelecek) state ve fonksiyonların tipleri
interface FilterFormProps {
  isDarkMode: boolean;
  
  unvan: string;
  setUnvan: (val: string) => void;
  
  meslekGrubu: string;
  setMeslekGrubu: (val: string) => void;
  meslekGruplari: string[];
  
  ilce: string;
  setIlce: (val: string) => void;
  ilceler: string[];
  
  naceKodu1: string;
  setNace1: (val: string) => void;
  naceKodu2: string;
  setNace2: (val: string) => void;
  naceKodu3: string;
  setNace3: (val: string) => void;
  
  handleSorgula: () => void;
  handleNaceYardim: () => void;
  handleExcelIndir: () => void;
  
  naceYardimAcik: boolean;
  firmalarLength: number;
  yukleniyor: boolean;
  isSearched: boolean;
  toplam: number;
}

export default function FilterForm({
  isDarkMode,
  unvan, setUnvan,
  meslekGrubu, setMeslekGrubu, meslekGruplari,
  ilce, setIlce, ilceler,
  naceKodu1, setNace1,
  naceKodu2, setNace2,
  naceKodu3, setNace3,
  handleSorgula, handleNaceYardim, handleExcelIndir,
  naceYardimAcik, firmalarLength, yukleniyor, isSearched, toplam
}: FilterFormProps) {
  return (
    <div className={`border rounded-lg p-5 ${isDarkMode ? 'border-[#162947] bg-[#0c192d]' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center gap-2 mb-6">
        <h2 className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Sorgu Kriterleri</h2>
      </div>

      <div className="space-y-4">
        {/* ŞİMDİLİK GÖRSEL, BAĞLI DEĞİL (Oda Sicil No / İlçe Kodu / Ticaret Sicil No) */}
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

        {/* Butonlar ve Nace Kodu */}
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
              className="bg-[#00a8ff] hover:bg-[#0097e6] text-white font-bold py-2 px-6 rounded text-sm transition"
            >
              {naceYardimAcik ? "Nace Kodu Yardım Kapat" : "Nace Kodu Yardım"}
            </button>
            <button 
              onClick={handleSorgula} 
              className="bg-[#4cd137] hover:bg-[#44bd32] text-white font-bold py-2 px-10 rounded text-sm transition"
            >
              Sorgula
            </button>
            <button
              type="button"
              onClick={handleExcelIndir}
              disabled={firmalarLength === 0 || yukleniyor}
              className="bg-[#4cd137] hover:bg-[#44bd32] text-white font-bold py-2 px-6 rounded text-sm transition flex items-center gap-2 disabled:bg-gray-400"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm60.1 106.5L222.4 341.6c-2.7 3-7.2 3-9.8 0l-16-17.7c-2.7-3-2.7-7.8 0-10.8l38.2-42.3h-100c-3.9 0-7-3.1-7-7v-20c0-3.9 3.1-7 7-7h100l-38.2-42.3c-2.7-3-2.7-7.8 0-10.8l16-17.7c2.7-3 7.2-3 9.8 0l61.7 68.3c3.1 3.5 3.1 9 0 12.4zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
              </svg>
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
  );
}