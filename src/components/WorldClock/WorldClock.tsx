import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { fromCountry, toCountry } from '@store/countries';
import { formatTime } from '@services/geo/timezone';

export function WorldClock() {
  const fromC = useStore(fromCountry);
  const toC = useStore(toCountry);
  const [times, setTimes] = useState<{ from: string; to: string }>({ from: '--:--:--', to: '--:--:--' });

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setTimes({
        from: fromC ? formatTime(now, fromC.timezone) : '--:--:--',
        to: toC ? formatTime(now, toC.timezone) : '--:--:--',
      });
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [fromC, toC]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-xl">🌐</span>
        Live World Clock
      </h3>
      <div className="space-y-4">
        <ClockItem
          country={fromC}
          time={times.from}
          label="From"
          color="red"
        />
        <ClockItem
          country={toC}
          time={times.to}
          label="To"
          color="blue"
        />
      </div>
    </div>
  );
}

function ClockItem({ country, time, label, color }: { country: any; time: string; label: string; color: string }) {
  const bgClass = color === 'red' ? 'bg-red-500/10' : 'bg-blue-500/10';
  const borderClass = color === 'red' ? 'border-l-4 border-red-500' : 'border-l-4 border-blue-500';

  if (!country) {
    return (
      <div className={`p-4 rounded-xl ${bgClass} ${borderClass}`}>
        <p className="text-[var(--text-secondary)]">Select {label.toLowerCase()} country</p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl ${bgClass} ${borderClass}`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{country.flag}</span>
        <div>
          <p className="font-semibold">{country.name}</p>
          <p className="text-xs text-[var(--text-secondary)]">{label} Country</p>
        </div>
      </div>
      <div className="font-mono text-2xl font-bold tabular-nums">{time}</div>
      <p className="text-xs text-[var(--text-secondary)] mt-1">{country.timezone}</p>
    </div>
  );
}