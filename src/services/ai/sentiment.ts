export interface SentimentResult {
  label: 'positive' | 'negative' | 'neutral';
  score: number;
}

let sentimentPipeline: any = null;

async function loadSentimentPipeline() {
  if (sentimentPipeline) return sentimentPipeline;

  const { pipeline } = await import('@xenova/transformers');
  sentimentPipeline = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
  return sentimentPipeline;
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  try {
    const classifier = await loadSentimentPipeline();
    const result = await classifier(text, { topk: 1 });

    if (result && result[0]) {
      return {
        label: result[0].label.toLowerCase() as 'positive' | 'negative' | 'neutral',
        score: Math.round(result[0].score * 100),
      };
    }

    return { label: 'neutral', score: 50 };
  } catch {
    return { label: 'neutral', score: 50 };
  }
}

export async function analyzeCountrySentiment(countryName: string): Promise<SentimentResult> {
  const statements = [
    `${countryName} is a beautiful country with rich culture`,
    `${countryName} has strong economic growth`,
    `${countryName} offers great tourism opportunities`,
  ];

  const sentiments = await Promise.all(statements.map(analyzeSentiment));

  const positiveCount = sentiments.filter((s) => s.label === 'positive').length;
  const avgScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;

  if (positiveCount >= 2) return { label: 'positive', score: Math.round(avgScore) };
  if (positiveCount === 0) return { label: 'negative', score: Math.round(avgScore) };
  return { label: 'neutral', score: Math.round(avgScore) };
}