import React from 'react';
import { FirmaDto } from '../lib/api';

interface FirmaKartiProps {
  firma: FirmaDto;
  isDarkMode: boolean;
}

export default function FirmaKarti({ firma, isDarkMode }: FirmaKartiProps) {
  return (
    <div className={`border rounded-lg p-5 shadow-sm hover:shadow-md transition-all ${isDarkMode ? 'bg-[#0f1f38] border-[#1f375b]' : 'bg-white border-gray-200'}`}>
      
      <div className="flex gap-3 mb-4 items-start">
        <div className={`w-10 h-10 rounded flex-shrink-0 flex items-center justify-center ${isDarkMode ? 'bg-[#162947] text-[#5b95ff]' : 'bg-[#eef2f9] text-[#4a85f6]'}`}>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 2H9c-1.103 0-2 .897-2 2v5.586l-4.707 4.707A1 1 0 0 0 2 15v6c0 1.103.897 2 2 2h15c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm-8 18H4v-4.586l3-3 4 4V20zm8 0h-6v-6.586l-2.293-2.293L12 9.828V4h7v16z"></path>
          </svg>
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
        <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{firma.tescilliAdresi}</div>
      </div>

    </div>
  );
}