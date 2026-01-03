
import React, { useState, useRef, useEffect } from 'react';
import { Currency } from '../types';
import { SUPPORTED_CURRENCIES } from '../constants';

interface CurrencyDropdownProps {
  selected: string;
  onChange: (code: string) => void;
  label: string;
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({ selected, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === selected) || SUPPORTED_CURRENCIES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest mb-2 block ml-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white/40 dark:bg-zinc-800/40 rounded-3xl border border-white/60 dark:border-zinc-700/50 shadow-sm active:bg-white/60 dark:active:bg-zinc-800 transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-700 flex items-center justify-center text-2xl shadow-sm border border-slate-50 dark:border-zinc-600">
            {selectedCurrency.flag}
          </div>
          <div className="flex flex-col items-start">
            <span className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">{selectedCurrency.code}</span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
              Selected
            </span>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Info Section below dropdown */}
      <div className="mt-2 px-2 flex items-center overflow-hidden">
        <div 
          key={selectedCurrency.code}
          className="flex items-center gap-2 bg-indigo-500/5 dark:bg-indigo-400/5 px-3 py-1 rounded-full border border-indigo-500/10 dark:border-indigo-400/10 animate-in fade-in slide-in-from-left-2 duration-500"
        >
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-tighter">Currency</span>
          <div className="h-2 w-[1px] bg-slate-200 dark:bg-zinc-800"></div>
          <span className="text-xs">{selectedCurrency.flag}</span>
          <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 truncate">
            {selectedCurrency.name}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-3 bg-white/95 dark:bg-zinc-900/95 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 backdrop-blur-3xl">
          <div className="max-h-64 overflow-y-auto p-2 space-y-1 scrollbar-hide">
            {SUPPORTED_CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => {
                  onChange(currency.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${
                  selected === currency.code
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 active:bg-slate-100 dark:active:bg-zinc-700'
                }`}
              >
                <span className="text-xl">{currency.flag}</span>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-bold">{currency.code}</span>
                  <span className={`text-[10px] font-medium opacity-60 ${selected === currency.code ? 'text-indigo-100' : ''}`}>
                    {currency.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyDropdown;
