import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { fromCountry, toCountry } from '@store/countries';
import { analyzeCountrySentiment } from '@services/ai';
import type { SentimentResult } from '@services/ai';
import type { Country } from '@app-types/country';

export function AISentiment() {
  const fromC = useStore(fromCountry);
  const toC = useStore(toCountry);
  const [fromSentiment, setFromSentiment] = useState<SentimentResult | null>(null);
  const [toSentiment, setToSentiment] = useState<SentimentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!fromC && !toC) return;

    async function analyze() {
      setIsLoading(true);
      try {
        if (fromC) {
          const result = await analyzeCountrySentiment(fromC.name);
          setFromSentiment(result);
        }
        if (toC) {
          const result = await analyzeCountrySentiment(toC.name);
          setToSentiment(result);
        }
      } finally {
        setIsLoading(false);
      }
    }

    analyze();
  }, [fromC, toC]);

  if (!fromC && !toC) {
    return (
      <div className="glass-card animate-fade-in">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-xl">🎯</span>
          AI Sentiment Analysis
        </h3>
        <p className="text-center text-[var(--text-secondary)] py-8">Select countries to see sentiment analysis</p>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-xl">🎯</span>
        AI Sentiment Analysis
        {isLoading && <span className="text-sm font-normal text-[var(--text-secondary)]">(analyzing...)</span>}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {fromC && (
          <SentimentCard country={fromC} sentiment={fromSentiment} />
        )}
        {toC && (
          <SentimentCard country={toC} sentiment={toSentiment} />
        )}
      </div>
    </div>
  );
}

function SentimentCard({ country, sentiment }: { country: Country; sentiment: SentimentResult | null }) {
  const sentimentColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-yellow-400',
  };

  const sentimentEmojis = {
    positive: '😊',
    negative: '😟',
    neutral: '😐',
  };

  return (
    <div className="p-4 rounded-xl bg-white/5 text-center">
      <span className="text-3xl block mb-2">{country.flag}</span>
      <span className="font-semibold block mb-2">{country.name}</span>
      {sentiment ? (
        <div>
          <span className="text-2xl block mb-1">{sentimentEmojis[sentiment.label]}</span>
          <span className={`text-sm font-medium ${sentimentColors[sentiment.label]}`}>
            {sentiment.label.charAt(0).toUpperCase() + sentiment.label.slice(1)}
          </span>
          <div className="mt-2">
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--primary-accent)] rounded-full"
                style={{ width: `${sentiment.score}%` }}
              />
            </div>
            <span className="text-xs text-[var(--text-secondary)] mt-1 block">{sentiment.score}%</span>
          </div>
        </div>
      ) : (
        <span className="text-sm text-[var(--text-secondary)]">Loading...</span>
      )}
    </div>
  );
}