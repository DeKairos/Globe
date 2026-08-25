import { useStore } from '@nanostores/react';
import { fromCountry, toCountry } from '@store/countries';

export function ComparisonCards() {
  const fromC = useStore(fromCountry);
  const toC = useStore(toCountry);

  if (!fromC || !toC) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="country-card animate-fade-in stagger-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🌍</span>
            <h3 className="text-xl font-bold">Source Country</h3>
          </div>
          <p className="text-[var(--text-secondary)]">Select a country to compare</p>
        </div>
        <div className="country-card animate-fade-in stagger-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🌍</span>
            <h3 className="text-xl font-bold">Destination Country</h3>
          </div>
          <p className="text-[var(--text-secondary)]">Select a country to compare</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CountryCard country={fromC} color="red" />
      <CountryCard country={toC} color="blue" />
    </div>
  );
}

function CountryCard({ country, color }: { country: any; color: string }) {
  const bgClass = color === 'red' ? 'bg-red-500/10' : 'bg-blue-500/10';

  return (
    <div className={`country-card animate-fade-in ${bgClass} border-l-4 border-${color}-500`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{country.flag}</span>
        <h3 className="text-xl font-bold">{country.name}</h3>
      </div>
      <div className="space-y-3">
        <DetailRow label="Capital" value={country.capital} />
        <DetailRow label="Population" value={country.population} />
        <DetailRow label="Continent" value={country.continent} />
        <DetailRow label="Timezone" value={country.timezone.split('/').pop()?.replace('_', ' ') || country.timezone} />
        <DetailRow label="Currency" value={`${country.currencySymbol}${country.currencyName} (${country.currency})`} />
        <a
          href={`https://en.wikipedia.org/wiki/${country.name.replace(/ /g, '_')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--primary-accent)] hover:underline"
        >
          📖 Learn More on Wikipedia
        </a>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span className="font-semibold text-right max-w-[70%] truncate">{value}</span>
    </div>
  );
}