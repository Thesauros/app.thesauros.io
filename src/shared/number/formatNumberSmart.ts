import { round } from './round';

const SUBSCRIPT_DIGITS: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
};

export const formatNumberSmart = (value: number): string => {
  if (!Number.isFinite(value)) {
    return String(value);
  }

  const isNegative = value < 0;
  const abs = Math.abs(value);

  if (abs === 0) {
    return '0';
  }

  if (abs >= 0.01) {
    return String(round(value, 2));
  }

  const exp = abs.toExponential(16);
  const match = exp.match(/^([0-9]+(?:\.[0-9]+)?)e-(\d+)$/i);
  if (!match) {
    return String(round(value, 2));
  }

  const mantissa = match[1];
  const exponent = parseInt(match[2], 10);

  const zerosCount = Math.max(0, exponent - 1);
  const digits = mantissa.replace('.', '').replace(/^0+/, '');
  const significantTwo = digits.length >= 2 ? digits.slice(0, 2) : (digits + '0').slice(0, 2);

  const subscript = String(zerosCount)
    .split('')
    .map(d => SUBSCRIPT_DIGITS[d] ?? d)
    .join('');

  const core = `0.0${subscript}${significantTwo}`;
  return isNegative ? `-${core}` : core;
};

export default formatNumberSmart;
