import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { distance, flightTime, timeDifference } from '@store/comparison';
import { fromCountry, toCountry } from '@store/countries';
import { fetchExchangeRates, getExchangeRate } from '@services/api/currency';

export function StatisticsPanel() {
  const dist = useStore(distance);
  const fTime = useStore(flightTime);
  const tDiff = useStore(timeDifference);
  const fromC = useStore(fromCountry);
  const toC = useStore(toCountry);

  const [exchangeRate, setExchangeRate] = useState<string>('--');

  useEffect(() => {
    if (fromC && toC) {
      fetchExchangeRates().then((rates) => {
        const rate = getExchangeRate(fromC.currency, toC.currency, rates);
        if (rate !== null) {
          setExchangeRate(`1:${rate.toFixed(4)}`);
        }
      });
    }
  }, [fromC, toC]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-xl">📊</span>
        Quick Statistics
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <StatItem
          icon="📏"
          label="Distance"
          value={dist !== null ? `${Math.round(dist).toLocaleString()} km` : '--'}
        />
        <StatItem
          icon="⏱️"
          label="Flight Time"
          value={fTime || '--'}
        />
        <StatItem
          icon="🕐"
          label="Time Gap"
          value={tDiff || '--'}
        />
        <StatItem
          icon="💱"
          label="Exchange"
          value={exchangeRate}
        />
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="stat-item">
      <span className="text-2xl mb-1 block">{icon}</span>
      <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider block mb-1">{label}</span>
      <span className="text-lg font-bold text-[var(--primary-accent)]">{value}</span>
    </div>
  );
}