{/* 4. Adım: NaceYardimPaneli Bileşenini İzole Etmek */}

import React from 'react';
import { NaceDto } from '../lib/api';

interface NaceYardimPaneliProps {
  isDarkMode: boolean;
  naceYardimAcik: boolean;
  naceFiltreKod: string;
  setNaceFiltreKod: (val: string) => void;
  naceFiltreAd: string;
  setNaceFiltreAd: (val: string) => void;
  naceListesi: NaceDto[];
  handleNaceSec: (kod: string) => void;
}

export default function NaceYardimPaneli({
  isDarkMode,
  naceYardimAcik,
  naceFiltreKod, setNaceFiltreKod,
  naceFiltreAd, setNaceFiltreAd,
  naceListesi,
  handleNaceSec
}: NaceYardimPaneliProps) {
  
  if (!naceYardimAcik) return null;

  return (
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
  );
}