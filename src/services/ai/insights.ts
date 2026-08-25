import type { Country } from '@app-types/country';

export interface CountryInsight {
  type: 'fact' | 'comparison' | 'recommendation';
  icon: string;
  text: string;
  confidence: number;
}

let pipeline: any = null;

async function loadPipeline() {
  if (pipeline) return pipeline;

  const { pipeline: loadPipeline } = await import('@xenova/transformers');
  pipeline = await loadPipeline('zero-shot-classification', 'Xenova/bart-large-mnli');
  return pipeline;
}

const CATEGORIES = [
  'cultural heritage',
  'economic strength',
  'tourism destination',
  'technological innovation',
  'natural resources',
  'historical significance',
  'geopolitical influence',
  'environmental sustainability',
];

export async function getCountryInsights(country: Country): Promise<CountryInsight[]> {
  const insights: CountryInsight[] = [];

  try {
    const classifier = await loadPipeline();

    const description = `${country.name} is a country in ${country.continent}. Its capital is ${country.capital}. It uses ${country.currencyName} as its currency. The population is approximately ${country.population}.`;

    const result = await classifier(description, CATEGORIES, {
      multi_label: true,
    });

    if (result && result.labels && result.scores) {
      const topCategories = result.labels
        .slice(0, 3)
        .map((label: string, i: number) => ({
          label,
          score: result.scores[i],
        }));

      topCategories.forEach(({ label, score }: { label: string; score: number }) => {
        insights.push({
          type: 'fact',
          icon: getCategoryIcon(label),
          text: `${country.name} is known for ${label}`,
          confidence: Math.round(score * 100),
        });
      });
    }
  } catch (error) {
    insights.push(
      {
        type: 'fact',
        icon: '🌍',
        text: `${country.name} has a population of ${country.population}`,
        confidence: 100,
      },
      {
        type: 'fact',
        icon: '🏛️',
        text: `The capital of ${country.name} is ${country.capital}`,
        confidence: 100,
      }
    );
  }

  return insights;
}

export async function getComparisonInsights(
  from: Country,
  to: Country
): Promise<CountryInsight[]> {
  const insights: CountryInsight[] = [];

  const fromPop = parseFloat(from.population.replace(/[MBK]/g, ''));
  const toPop = parseFloat(to.population.replace(/[MBK]/g, ''));
  const fromMult = from.population.includes('B') ? 1e9 : from.population.includes('M') ? 1e6 : 1e3;
  const toMult = to.population.includes('B') ? 1e9 : to.population.includes('M') ? 1e6 : 1e3;
  const fromPopNum = fromPop * fromMult;
  const toPopNum = toPop * toMult;

  if (!isNaN(fromPopNum) && !isNaN(toPopNum)) {
    const ratio = Math.max(fromPopNum, toPopNum) / Math.min(fromPopNum, toPopNum);
    if (ratio > 2) {
      const larger = fromPopNum > toPopNum ? from.name : to.name;
      insights.push({
        type: 'comparison',
        icon: '👥',
        text: `${larger} has ${ratio.toFixed(1)}x more people`,
        confidence: 100,
      });
    }
  }

  if (from.continent === to.continent) {
    insights.push({
      type: 'comparison',
      icon: '🗺️',
      text: `Both countries are in ${from.continent} - they likely share cultural similarities`,
      confidence: 85,
    });
  } else {
    insights.push({
      type: 'comparison',
      icon: '🌏',
      text: `These countries span different continents, offering diverse cultural experiences`,
      confidence: 80,
    });
  }

  if (from.currency === to.currency) {
    insights.push({
      type: 'recommendation',
      icon: '💱',
      text: `Both use ${from.currencyName} - no currency exchange needed!`,
      confidence: 100,
    });
  }

  return insights;
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'cultural heritage': '🎭',
    'economic strength': '💰',
    'tourism destination': '✈️',
    'technological innovation': '🔬',
    'natural resources': '🌿',
    'historical significance': '📜',
    'geopolitical influence': '🏛️',
    'environmental sustainability': '♻️',
  };
  return icons[category] || '📌';
}