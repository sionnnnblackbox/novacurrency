
import React from 'react';
import { ConversionHistory } from '../types';
import { formatCurrency } from '../services/currencyService';

interface HistoryListProps {
  history: ConversionHistory[];
  onClear: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onClear }) => {
  return (
    <div className="glass-card rounded-[2.5rem] p-6 shadow-xl border-white/60 dark:border-zinc-800/50">
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Logs</h3>
          <p className="text-sm font-black text-slate-900 dark:text-white">Recent Activity</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="py-6 flex flex-col items-center text-center opacity-30">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Feed Empty</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between group animate-in slide-in-from-right-4 duration-500"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-50"></div>
                <div>
                  <div className="text-[11px] font-black text-slate-800 dark:text-white leading-none">
                    {item.fromAmount} {item.from} → {item.to}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(item.toAmount, item.to)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {history.length > 4 && (
        <div className="mt-6 pt-4 border-t border-slate-50 dark:border-zinc-800/50 text-center">
          <button className="text-[9px] font-black text-slate-300 dark:text-zinc-600 hover:text-indigo-500 uppercase tracking-[0.3em] transition-colors">
            Tap for full history
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryList;
