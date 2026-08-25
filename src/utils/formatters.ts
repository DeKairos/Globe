export function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
}

export function formatCurrency(amount: number, currency: string, symbol: string): string {
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export function formatRate(rate: number): string {
  if (rate >= 1) return rate.toFixed(4);
  if (rate >= 0.01) return rate.toFixed(4);
  if (rate >= 0.0001) return rate.toFixed(6);
  return rate.toExponential(2);
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function parsePopulation(popStr: string): number {
  const num = parseFloat(popStr.replace(/[MBK]/g, ''));
  if (popStr.includes('B')) return num * 1e9;
  if (popStr.includes('M')) return num * 1e6;
  if (popStr.includes('K')) return num * 1e3;
  return num;
}