
import React, { useState, useEffect, useCallback } from 'react';
import CurrencyDropdown from './components/CurrencyDropdown';
import ThemeToggle from './components/ThemeToggle';
import { SUPPORTED_CURRENCIES, REFRESH_INTERVAL } from './constants';
import { ExchangeRates } from './types';
import { fetchExchangeRates, formatCurrency } from './services/currencyService';
import { getCurrencyInsight } from './services/geminiService';

const App: React.FC = () => {
  const [amount, setAmount] = useState<string>('1000');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [insight, setInsight] = useState<string>("");
  const [isInsightLoading, setIsInsightLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const loadRates = useCallback(async (base: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchExchangeRates(base);
      setRates(data.rates);
      setLastUpdated(data.time_last_update_unix * 1000);
    } catch (err) {
      setError("Market sync failed. Retrying...");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRates(fromCurrency);
    const interval = setInterval(() => loadRates(fromCurrency), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadRates, fromCurrency]);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const getConversion = () => {
    const num = parseFloat(amount);
    if (!rates || isNaN(num)) return 0;
    const rate = rates[toCurrency];
    return num * rate;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const amt = parseFloat(amount);
      if (amt > 0) {
        fetchInsight();
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [fromCurrency, toCurrency, amount]);

  const fetchInsight = async () => {
    setIsInsightLoading(true);
    const text = await getCurrencyInsight(fromCurrency, toCurrency);
    setInsight(text);
    setIsInsightLoading(false);
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-20 flex flex-col items-center max-w-lg mx-auto overflow-x-hidden transition-colors duration-700 bg-transparent">
      
      {/* Mobile-Native Header */}
      <header className="w-full flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Nova<span className="text-gradient">Currency</span>
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Market Live</span>
          </div>
        </div>
        <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
      </header>

      <main className="w-full space-y-6">
        
        {/* Input & Converter Section */}
        <section className="glass-card rounded-[2.5rem] p-6 shadow-2xl shadow-indigo-500/5 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Amount Box */}
          <div className="mb-8 text-center">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Enter Amount</label>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-center text-6xl font-black text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-100 dark:placeholder:text-zinc-800 transition-all"
              placeholder="0"
            />
            <div className="flex justify-center mt-2">
              <div className="h-1 w-12 bg-indigo-500/20 rounded-full"></div>
            </div>
          </div>

          {/* Currency Controls */}
          <div className="space-y-4">
            <CurrencyDropdown
              label="From"
              selected={fromCurrency}
              onChange={setFromCurrency}
            />
            
            <div className="flex justify-center -my-3 relative z-10">
              <button
                onClick={handleSwap}
                className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full shadow-xl border border-slate-100 dark:border-zinc-700 flex items-center justify-center text-indigo-500 active:scale-90 transition-all hover:shadow-indigo-500/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            <CurrencyDropdown
              label="To"
              selected={toCurrency}
              onChange={setToCurrency}
            />
          </div>

          {/* Result Highlight */}
          <div className="mt-10 p-6 bg-slate-50 dark:bg-zinc-900/50 rounded-[2rem] border border-slate-100 dark:border-zinc-800/50 text-center transition-colors">
            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em] mb-2 block">Result</span>
            <div className="text-4xl font-black text-slate-900 dark:text-white mb-2 truncate">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500/40 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500/40 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500/40 animate-bounce"></span>
                </span>
              ) : formatCurrency(getConversion(), toCurrency)}
            </div>
            <div className="text-[11px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-400/10 py-1.5 px-4 rounded-full inline-block transition-colors">
              1 {fromCurrency} = {rates ? rates[toCurrency].toFixed(4) : '...'} {toCurrency}
            </div>
          </div>
        </section>

        {/* AI Insight Card */}
        <section className="glass-card rounded-3xl p-5 border-indigo-500/5 shadow-lg shadow-indigo-500/5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-xl flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">AI Market Tip</h3>
            {isInsightLoading && <div className="ml-auto w-3 h-3 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>}
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 leading-relaxed italic pr-2">
            {insight || "Analyzing the best time to exchange..."}
          </p>
        </section>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-3 transition-colors">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            {error}
          </div>
        )}

        {/* Last Updated Label */}
        <div className="text-center">
          <p className="text-[9px] font-black text-slate-300 dark:text-zinc-700 uppercase tracking-[0.4em] transition-colors">
            Last Sync: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Refreshing...'}
          </p>
        </div>
      </main>

      <footer className="mt-auto pt-10 text-center pb-4 opacity-50">
        <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest transition-colors">
          &copy; 2025 Nova Dynamics
        </p>
      </footer>
    </div>
  );
};

export default App;
