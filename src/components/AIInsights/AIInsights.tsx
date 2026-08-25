import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { fromCountry, toCountry } from '@store/countries';
import { getCountryInsights, getComparisonInsights } from '@services/ai';
import type { CountryInsight } from '@services/ai';
import { useToast } from '@hooks';

export function AIInsights() {
  const fromC = useStore(fromCountry);
  const toC = useStore(toCountry);
  const { addToast } = useToast();
  const [insights, setInsights] = useState<CountryInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!fromC) return;

    async function loadInsights() {
      if (!fromC) return;
      setIsLoading(true);
      try {
        const countryInsights = await getCountryInsights(fromC);
        if (toC) {
          const comparisonInsights = await getComparisonInsights(fromC, toC);
          setInsights([...countryInsights, ...comparisonInsights]);
        } else {
          setInsights(countryInsights);
        }
      } catch (error) {
        addToast('Failed to load AI insights', 'error');
      } finally {
        setIsLoading(false);
      }
    }

    loadInsights();
  }, [fromC, toC]);

  if (!fromC) {
    return (
      <div className="glass-card animate-fade-in">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-xl">🤖</span>
          AI Country Insights
        </h3>
        <p className="text-center text-[var(--text-secondary)] py-8">Select a country to see AI-powered insights</p>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-xl">🤖</span>
        AI Country Insights
        {isLoading && <span className="text-sm font-normal text-[var(--text-secondary)]">(analyzing...)</span>}
      </h3>

      {insights.length === 0 && !isLoading ? (
        <p className="text-center text-[var(--text-secondary)] py-4">No insights available</p>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
}

function InsightCard({ insight }: { insight: CountryInsight }) {
  const typeColors: Record<string, string> = {
    fact: 'border-blue-500',
    comparison: 'border-purple-500',
    recommendation: 'border-green-500',
  };

  return (
    <div className={`p-4 rounded-xl bg-white/5 border-l-4 ${typeColors[insight.type]} transition-all hover:bg-white/10`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{insight.icon}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{insight.text}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--primary-accent)] rounded-full transition-all"
                style={{ width: `${insight.confidence}%` }}
              />
            </div>
            <span className="text-xs text-[var(--text-secondary)]">{insight.confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}