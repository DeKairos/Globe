import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { fromCountry, toCountry } from '@store/countries';
import { convertTime } from '@services/geo/timezone';

export function TimezoneConverter() {
  const fromC = useStore(fromCountry);
  const toC = useStore(toCountry);
  const [converterTime, setConverterTime] = useState(
    new Date().toTimeString().slice(0, 5)
  );
  const [convertedTime, setConvertedTime] = useState('--:--');
  const [dayDiff, setDayDiff] = useState(0);

  useEffect(() => {
    if (fromC && toC && converterTime) {
      const result = convertTime(converterTime, fromC.timezone, toC.timezone);
      setConvertedTime(result.time);
      setDayDiff(result.dayDiff);
    }
  }, [converterTime, fromC, toC]);

  const formatDayDiff = (diff: number) => {
    if (diff === 0) return '';
    if (diff > 0) return ` (+${diff} day${diff > 1 ? 's' : ''})`;
    return ` (${diff} day${diff < -1 ? 's' : ''})`;
  };

  if (!fromC || !toC) {
    return (
      <div className="glass-card animate-fade-in">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-xl">🕐</span>
          Timezone Converter
        </h3>
        <p className="text-center text-[var(--text-secondary)] py-8">Select two countries to convert times</p>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-xl">🕐</span>
        Timezone Converter
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Time to Convert
          </label>
          <input
            type="time"
            value={converterTime}
            onChange={(e) => setConverterTime(e.target.value)}
            className="input-search"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 border-l-4 border-red-500">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{fromC.flag}</span>
              <span className="font-semibold">{fromC.name}</span>
            </div>
            <div className="font-mono text-xl font-bold tabular-nums">
              {converterTime}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{fromC.timezone}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{toC.flag}</span>
              <span className="font-semibold">{toC.name}</span>
            </div>
            <div className="font-mono text-xl font-bold tabular-nums">
              {convertedTime}{formatDayDiff(dayDiff)}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{toC.timezone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}