import React from 'react';

// Bileşenin dışarıdan alacağı özellikleri (props) tiplendiriyoruz
interface NavbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export default function Navbar({ isDarkMode, setIsDarkMode }: NavbarProps) {
  return (
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
  );
}