'use client';

import { useEffect, useState, useRef } from 'react';
import { RefreshCw, Wifi, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const PING_INTERVAL = 30000; // 30 seconds

interface BackgroundWorkerProps {
  onNewOrdersFound?: (count: number) => void;
}

export default function BackgroundWorker({ onNewOrdersFound }: BackgroundWorkerProps) {
  const [lastPing, setLastPing] = useState<Date | null>(null);
  const [nextPingIn, setNextPingIn] = useState(30);
  const [isPinging, setIsPinging] = useState(false);
  const [pingStatus, setPingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [totalPings, setTotalPings] = useState(0);
  const intervalRef = useRef<any>(null);
  const countdownRef = useRef<any>(null);

  const performPing = async () => {
    setIsPinging(true);
    setPingStatus('idle');

    try {
      // BACKEND INTEGRATION: Replace with Turso query for pending orders
      // const { rows } = await turso.execute({
      //   sql: 'SELECT id, status FROM orders WHERE status = ? AND created_at > ?',
      //   args: ['Pending', new Date(Date.now() - 5 * 60 * 1000).toISOString()]
      // });

      await new Promise((r) => setTimeout(r, 400)); // Simulate network latency

      // Simulate occasionally finding new pending orders
      const foundNew = Math.random() > 0.75;
      if (foundNew) {
        const count = Math.floor(Math.random() * 2) + 1;
        onNewOrdersFound?.(count);
        toast.info(`${count} new pending order${count > 1 ? 's' : ''} detected`, {
          description: 'Background worker found new orders',
        });
      }

      setLastPing(new Date());
      setTotalPings((p) => p + 1);
      setPingStatus('success');
    } catch {
      setPingStatus('error');
      toast.error('Background worker failed to reach database', {
        description: 'Will retry in 30 seconds',
      });
    } finally {
      setIsPinging(false);
      setNextPingIn(30);
    }
  };

  useEffect(() => {
    // Start background worker
    performPing();

    intervalRef.current = setInterval(performPing, PING_INTERVAL);

    countdownRef.current = setInterval(() => {
      setNextPingIn((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs"
      style={{
        background: 'rgba(10, 16, 35, 0.6)',
        border: '1px solid rgba(99, 102, 241, 0.12)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Status icon */}
      <div className="flex items-center gap-1.5">
        {isPinging ? (
          <RefreshCw size={12} className="text-emerald-400 animate-spin" />
        ) : pingStatus === 'error' ? (
          <AlertCircle size={12} className="text-red-400" />
        ) : (
          <Wifi size={12} className="text-emerald-400" />
        )}
        <span
          className={`font-medium ${pingStatus === 'error' ? 'text-red-400' : 'text-emerald-400'}`}
        >
          Worker {isPinging ? 'Pinging...' : pingStatus === 'error' ? 'Error' : 'Active'}
        </span>
      </div>

      <span className="text-slate-600">|</span>

      {/* Countdown */}
      <span className="text-slate-400">
        Next ping: <span className="tabular text-slate-300 font-semibold">{nextPingIn}s</span>
      </span>

      <span className="text-slate-600">|</span>

      {/* Last ping */}
      <span className="text-slate-500 hidden sm:inline">
        Last:{' '}
        <span className="text-slate-400">
          {lastPing
            ? lastPing.toLocaleTimeString('en-PH', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
            : '--:--:--'}
        </span>
      </span>

      <span className="text-slate-600 hidden sm:inline">|</span>

      <span className="text-slate-500 hidden md:inline">
        Pings: <span className="tabular text-slate-400">{totalPings}</span>
      </span>

      {/* Progress bar */}
      <div className="flex-1 hidden lg:block">
        <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500/60 transition-all duration-1000"
            style={{ width: `${((30 - nextPingIn) / 30) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
