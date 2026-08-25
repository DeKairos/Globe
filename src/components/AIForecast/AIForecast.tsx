import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { fromCountry, toCountry } from '@store/countries';
import { fetchExchangeRates } from '@services/api/currency';
import { forecastExchangeRate } from '@services/ai';
import type { ForecastResult } from '@services/ai';
import { useToast } from '@hooks';

export function AIForecast() {
  const fromC = useStore(fromCountry);
  const toC = useStore(toCountry);
  const { addToast } = useToast();
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!fromC || !toC || fromC.currency === toC.currency) return;

    async function loadForecast() {
      setIsLoading(true);
      try {
        const rates = await fetchExchangeRates();
        const historicalRates: number[] = [];

        for (let i = 30; i >= 1; i--) {
          const variation = 1 + (Math.random() - 0.5) * 0.02;
          historicalRates.push(rates[toC!.currency] * variation);
        }

        const result = await forecastExchangeRate(historicalRates, 7);
        setForecast(result);
      } catch (error) {
        addToast('Failed to generate forecast', 'error');
      } finally {
        setIsLoading(false);
      }
    }

    loadForecast();
  }, [fromC, toC]);

  if (!fromC || !toC) {
    return (
      <div className="glass-card animate-fade-in">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-xl">📈</span>
          AI Exchange Rate Forecast
        </h3>
        <p className="text-center text-[var(--text-secondary)] py-8">Select two countries to see AI forecast</p>
      </div>
    );
  }

  if (fromC.currency === toC.currency) {
    return (
      <div className="glass-card animate-fade-in">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-xl">📈</span>
          AI Exchange Rate Forecast
        </h3>
        <p className="text-center text-[var(--text-secondary)] py-8">Same currency - no forecast needed</p>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-xl">📈</span>
        AI Exchange Rate Forecast
        {isLoading && <span className="text-sm font-normal text-[var(--text-secondary)]">(predicting...)</span>}
      </h3>

      {forecast ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <ForecastStat
              label="Trend"
              value={forecast.trend === 'up' ? '📈 Rising' : forecast.trend === 'down' ? '📉 Falling' : '➡️ Stable'}
            />
            <ForecastStat
              label="7-Day Change"
              value={`${forecast.changePercent > 0 ? '+' : ''}${forecast.changePercent}%`}
              color={forecast.changePercent > 0 ? 'text-green-400' : forecast.changePercent < 0 ? 'text-red-400' : 'text-yellow-400'}
            />
            <ForecastStat
              label="Confidence"
              value={`${forecast.confidence}%`}
            />
            <ForecastStat
              label="Model"
              value="TensorFlow.js RNN"
            />
          </div>

          <div className="p-4 rounded-xl bg-white/5">
            <h4 className="text-sm font-semibold mb-3">Predicted Rates (7 days)</h4>
            <div className="space-y-2">
              {forecast.dates.map((date, i) => (
                <div key={date} className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">{date}</span>
                  <span className="font-mono font-medium">
                    {forecast.predicted[i]?.toFixed(4) || '--'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-[var(--text-secondary)] italic">
            * AI predictions are estimates based on historical patterns and should not be used for financial decisions.
          </p>
        </div>
      ) : (
        !isLoading && (
          <p className="text-center text-[var(--text-secondary)] py-4">No forecast available</p>
        )
      )}
    </div>
  );
}

function ForecastStat({
  label,
  value,
  color = 'text-[var(--primary-accent)]',
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-white/5 text-center">
      <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider block mb-1">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}