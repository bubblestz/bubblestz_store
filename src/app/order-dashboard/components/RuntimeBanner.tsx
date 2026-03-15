'use client';

import { useState, useEffect } from 'react';
import { Zap, RefreshCw } from 'lucide-react';

interface RealtimeBannerProps {
  lastEventAt?: Date;
}

export default function RealtimeBanner({ lastEventAt }: RealtimeBannerProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!lastEventAt) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 1500);
    return () => clearTimeout(t);
  }, [lastEventAt]);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs
        transition-all duration-300
        ${pulse ? 'border-emerald-400/40' : ''}
      `}
      style={{
        background: pulse ? 'rgba(110, 231, 183, 0.08)' : 'rgba(10, 16, 35, 0.6)',
        border: `1px solid ${pulse ? 'rgba(110, 231, 183, 0.3)' : 'rgba(99, 102, 241, 0.12)'}`,
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${pulse ? 'bg-emerald-400 pulse-dot' : 'bg-emerald-400/60'}`}
        />
        <Zap size={11} className="text-emerald-400" />
        <span className="font-semibold text-emerald-400">Turso Realtime</span>
      </div>
      <span className="text-slate-600">|</span>
      <span className="text-slate-400">
        Channel: <span className="text-slate-300 font-medium">orders</span>
      </span>
      <span className="text-slate-600">|</span>
      <span className="text-slate-400">
        Events: <span className="text-slate-300 font-medium tabular">INSERT, UPDATE</span>
      </span>
      {lastEventAt && (
        <>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <RefreshCw size={10} />
            Last event:{' '}
            {lastEventAt.toLocaleTimeString('en-PH', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </>
      )}
    </div>
  );
}
