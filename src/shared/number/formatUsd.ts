/**
 * Money is always shown with two decimals and thousand separators, on desktop
 * and on mobile alike.
 */
export const formatUsd = (value: number): string => {
  if (!Number.isFinite(value)) {
    return '0.00';
  }
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
