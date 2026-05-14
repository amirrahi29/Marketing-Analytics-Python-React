export function formatCurrency(value: number, compact = false): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 2,
  }).format(value);
}

export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, fraction = 1): string {
  return `${value.toFixed(fraction)}%`;
}

export function parsePercentString(s: string): number {
  return Number.parseFloat(s.replace('%', '')) || 0;
}

export function trendLabel(delta: number): { text: string; positive: boolean } {
  if (!Number.isFinite(delta) || delta === 0) {
    return { text: '0%', positive: true };
  }
  const positive = delta > 0;
  const text = `${positive ? '+' : ''}${delta.toFixed(1)}%`;
  return { text, positive };
}
