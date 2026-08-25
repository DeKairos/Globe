import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { selectedFrom, selectedTo, setFromCountry, setToCountry, swapCountries } from '@store/countries';
import { globeView, toggleGlobeView } from '@store/ui';
import { fetchExchangeRates } from '@services/api/currency';
import { getFavorites, getHistory } from '@services/storage';
import { parseURLParams } from '@utils/url';
import { ToastContainer } from '@components/Toast';
import { CountrySearch } from '@components/CountrySearch';
import { GlobeView } from '@components/GlobeView';
import { ComparisonCards } from '@components/ComparisonCards';
import { WorldClock } from '@components/WorldClock';
import { StatisticsPanel } from '@components/StatisticsPanel';
import { CurrencyConverter } from '@components/CurrencyConverter';
import { TimezoneConverter } from '@components/TimezoneConverter';
import { FlightInfo } from '@components/FlightInfo';
import { ComparisonTable } from '@components/ComparisonTable';
import { AIInsights } from '@components/AIInsights';
import { AIForecast } from '@components/AIForecast';
import { AISentiment } from '@components/AISentiment';
import { useFavoriteStatus } from '@hooks/useFavoriteStatus';

export function App() {
  const fromCode = useStore(selectedFrom);
  const toCode = useStore(selectedTo);
  const currentGlobeView = useStore(globeView);
  const fromFavorite = useFavoriteStatus(fromCode);
  const toFavorite = useFavoriteStatus(toCode);

  useEffect(() => {
    async function initialize() {
      await getFavorites();
      await getHistory();
      parseURLParams(setFromCountry, setToCountry);
      await fetchExchangeRates();
    }
    initialize();
  }, []);

  const handleToggleGlobe = () => {
    toggleGlobeView();
  };

  const handleSwap = () => {
    swapCountries();
  };

  const handleResetView = () => {
    // GlobeView handles reset internally via its own logic
  };

  return (
    <div className="min-h-screen">
      <ToastContainer />

      <header className="p-6 md:p-10 text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-[var(--primary-accent)] to-[var(--secondary-accent)] bg-clip-text text-transparent mb-2">
          Globe Connect
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">Explore global connections in real-time</p>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-12">
        <section className="glass-card p-6 mb-6 animate-fade-in stagger-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <CountrySearch
              label="From"
              value={fromCode}
              onChange={setFromCountry}
              onFavorite={setFromCountry}
              isFavorite={fromFavorite}
            />
            <CountrySearch
              label="To"
              value={toCode}
              onChange={setToCountry}
              onFavorite={setToCountry}
              isFavorite={toFavorite}
            />
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={handleToggleGlobe} className="btn-secondary">
              {currentGlobeView === 'night' ? '☀️ Switch to Day' : '🌙 Switch to Night'}
            </button>
            <button onClick={handleSwap} className="btn-secondary">
              ⇄ Swap Countries
            </button>
            <button onClick={handleResetView} className="btn-secondary">
              🔄 Reset View
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GlobeView />
            <ComparisonCards />
            <FlightInfo />
          </div>

          <div className="space-y-6">
            <WorldClock />
            <StatisticsPanel />
            <CurrencyConverter />
            <TimezoneConverter />
            <AIInsights />
            <AISentiment />
            <AIForecast />
            <ComparisonTable />
          </div>
        </div>

        <footer className="mt-12 text-center text-[var(--text-secondary)] text-sm">
          <p>Built with React, TypeScript, Tailwind, Globe.gl, Three.js</p>
          <p className="mt-1">Data from ExchangeRate-API, OpenWeatherMap, REST Countries</p>
        </footer>
      </main>
    </div>
  );
}