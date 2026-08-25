import { useStore } from '@nanostores/react';
import { fromCountry, toCountry } from '@store/countries';
import { distance, flightTime, timeDifference, route } from '@store/comparison';

export function FlightInfo() {
  const dist = useStore(distance);
  const fTime = useStore(flightTime);
  const tDiff = useStore(timeDifference);
  const rte = useStore(route);
  const fromC = useStore(fromCountry);
  const toC = useStore(toCountry);

  if (!fromC || !toC || dist === null) {
    return (
      <div className="glass-card animate-fade-in">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-xl">✈️</span>
          Flight Information
        </h3>
        <p className="text-center text-[var(--text-secondary)] py-8">Select two countries to see flight details</p>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-xl">✈️</span>
        Flight Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <FlightDetail
          icon="📏"
          label="Distance"
          value={`${Math.round(dist).toLocaleString()} km`}
        />
        <FlightDetail
          icon="⏱️"
          label="Est. Flight Time"
          value={fTime || '--'}
        />
        <FlightDetail
          icon="🕐"
          label="Time Difference"
          value={tDiff || '--'}
        />
        <FlightDetail
          icon="🛫"
          label="Route"
          value={rte || '--'}
        />
      </div>
    </div>
  );
}

function FlightDetail({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors">
      <span className="text-2xl mb-1 block">{icon}</span>
      <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider block mb-1">{label}</span>
      <span className="font-semibold text-[var(--primary-accent)]">{value}</span>
    </div>
  );
}