/**
 * Helper to convert English digits to Bengali digits and vice-versa
 */

const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBnNumber(val: number | string): string {
  if (val === undefined || val === null) return '';
  const str = String(val);
  return str.replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)] || digit);
}

export function formatPercent(value: number, total: number, useBn: boolean = true): { percent: number; text: string } {
  if (!total || total === 0) return { percent: 0, text: useBn ? '০%' : '0%' };
  const rawPct = (value / total) * 100;
  const pctRounded = Math.round(rawPct * 10) / 10;
  const formattedPct = pctRounded % 1 === 0 ? pctRounded.toFixed(0) : pctRounded.toFixed(1);
  return {
    percent: rawPct,
    text: useBn ? `${toBnNumber(formattedPct)}%` : `${formattedPct}%`,
  };
}

export function formatNum(n: number | string, useBn: boolean = true): string {
  return useBn ? toBnNumber(n) : String(n);
}
