import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-900 text-slate-300 px-5 py-1.5 flex items-center justify-between text-[11px] font-semibold select-none border-b border-slate-800/60 z-30">
      {/* Time */}
      <span className="tracking-tight text-white font-bold">{time || '10:45'}</span>

      {/* Android Status Icons */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">5G</span>
        <Signal className="w-3.5 h-3.5 text-slate-300" />
        <Wifi className="w-3.5 h-3.5 text-slate-300" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400">98%</span>
          <BatteryMedium className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};