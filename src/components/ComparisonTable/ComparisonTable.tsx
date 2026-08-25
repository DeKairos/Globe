import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { allCountries, selectedFrom, selectedTo } from '@store/countries';
import { useToast } from '@hooks';
import type { CountryCode } from '@app-types/country';

export function ComparisonTable() {
  const countries = useStore(allCountries);
  const fromCode = useStore(selectedFrom);
  const toCode = useStore(selectedTo);
  const { addToast } = useToast();

  const [tableCountries, setTableCountries] = useState<CountryCode[]>([]);

  const addCountry = (code: CountryCode) => {
    if (!tableCountries.includes(code)) {
      setTableCountries([...tableCountries, code]);
      addToast(`Added ${code} to comparison table`, 'success');
    } else {
      addToast('Country already in table', 'info');
    }
  };

  const removeCountry = (code: CountryCode) => {
    setTableCountries(tableCountries.filter((c) => c !== code));
    addToast('Removed from comparison table', 'info');
  };

  const clearTable = () => {
    setTableCountries([]);
    addToast('Comparison table cleared', 'info');
  };

  const getCountry = (code: CountryCode) => countries.find((c) => c.code === code);

  return (
    <div className="glass-card animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">📊</span>
          Comparison Table
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => addCountry(fromCode)}
            disabled={tableCountries.includes(fromCode)}
            className="btn-secondary text-sm px-4 py-2"
          >
            ➕ Add {fromCode}
          </button>
          <button
            onClick={() => addCountry(toCode)}
            disabled={tableCountries.includes(toCode)}
            className="btn-secondary text-sm px-4 py-2"
          >
            ➕ Add {toCode}
          </button>
          {tableCountries.length > 0 && (
            <button onClick={clearTable} className="btn-secondary text-sm px-4 py-2">
              🗑️ Clear
            </button>
          )}
        </div>
      </div>

      {tableCountries.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-secondary)]">
          <p className="text-lg mb-2">No countries in comparison table</p>
          <p className="text-sm">Select countries and click "Add" to compare them side by side</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Country</th>
                <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Capital</th>
                <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Population</th>
                <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Continent</th>
                <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Timezone</th>
                <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Currency</th>
                <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableCountries.map((code) => {
                const country = getCountry(code);
                if (!country) return null;
                return (
                  <tr key={code} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-3 flex items-center gap-2">
                      <span className="text-xl">{country.flag}</span>
                      <span className="font-medium">{country.name}</span>
                    </td>
                    <td className="p-3">{country.capital}</td>
                    <td className="p-3">{country.population}</td>
                    <td className="p-3">{country.continent}</td>
                    <td className="p-3">
                      {country.timezone.split('/').pop()?.replace('_', ' ') || country.timezone}
                    </td>
                    <td className="p-3">
                      {country.currencySymbol}{country.currencyName} ({country.currency})
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => removeCountry(code)}
                        className="btn-icon p-2 text-red-400 hover:bg-red-500/10"
                        aria-label={`Remove ${country.name}`}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}