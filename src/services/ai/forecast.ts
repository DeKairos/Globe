export interface ForecastResult {
  dates: string[];
  predicted: number[];
  actual: number[];
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export async function forecastExchangeRate(
  historicalRates: number[],
  days: number = 7
): Promise<ForecastResult> {
  if (historicalRates.length < 7) {
    throw new Error('Need at least 7 days of historical data');
  }

  const tf = await import('@tensorflow/tfjs');
  const { sequential, layers } = tf;

  const normalizedData = normalizeData(historicalRates);

  const lookback = 7;
  const { xs, ys } = createSequences(normalizedData, lookback, tf);

  const model = sequential();
  model.add(layers.simpleRNN({
    units: 32,
    inputShape: [lookback, 1],
    returnSequences: false,
  }));
  model.add(layers.dense({ units: 16, activation: 'relu' }));
  model.add(layers.dense({ units: 1 }));

  model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError',
  });

  await model.fit(xs, ys, {
    epochs: 50,
    batchSize: 8,
    verbose: 0,
  });

  const predictions: number[] = [];
  let currentSequence = [...normalizedData.slice(-lookback)];

  for (let i = 0; i < days; i++) {
    const inputTensor = tf.tensor([currentSequence], [1, lookback, 1]);
    const output = model.predict(inputTensor);
    let pred: number;
    if (Array.isArray(output)) {
      pred = (await output[0].data())[0];
      output.forEach((t) => t.dispose());
    } else {
      pred = (await output.data())[0];
      output.dispose();
    }
    inputTensor.dispose();
    predictions.push(pred);
    currentSequence = [...currentSequence.slice(1), pred];
  }

  const denormalizedPredictions = denormalizeData(predictions, historicalRates);

  const today = new Date();
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0];
  });

  const lastActual = historicalRates[historicalRates.length - 1];
  const predictedEnd = denormalizedPredictions[denormalizedPredictions.length - 1];
  const changePercent = ((predictedEnd - lastActual) / lastActual) * 100;

  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (changePercent > 1) trend = 'up';
  else if (changePercent < -1) trend = 'down';

  const volatility = calculateVolatility(historicalRates);
  const confidence = Math.max(0, Math.min(100, 100 - volatility * 10));

  xs.dispose();
  ys.dispose();
  model.dispose();

  return {
    dates,
    predicted: denormalizedPredictions,
    actual: historicalRates.slice(-days),
    confidence: Math.round(confidence),
    trend,
    changePercent: Math.round(changePercent * 100) / 100,
  };
}

function normalizeData(data: number[]): number[] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  if (range === 0) return data.map(() => 0.5);
  return data.map((v) => (v - min) / range);
}

function denormalizeData(normalized: number[], original: number[]): number[] {
  const min = Math.min(...original);
  const max = Math.max(...original);
  const range = max - min;
  return normalized.map((v) => v * range + min);
}

function createSequences(data: number[], lookback: number, tf: any) {
  const sequences: number[][] = [];
  const labels: number[] = [];

  for (let i = lookback; i < data.length; i++) {
    sequences.push(data.slice(i - lookback, i));
    labels.push(data[i]);
  }

  const xs = tf.tensor(sequences, [sequences.length, lookback, 1]);
  const ys = tf.tensor(labels, [labels.length, 1]);

  return { xs, ys };
}

function calculateVolatility(data: number[]): number {
  const returns: number[] = [];
  for (let i = 1; i < data.length; i++) {
    returns.push((data[i] - data[i - 1]) / data[i - 1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  return Math.sqrt(variance);
}