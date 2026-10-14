/**
 * Every percentage in the UI goes through here so that the dashboard card, the
 * chart legend, the chart tooltip and the deposit modal all render the same
 * value with the same precision.
 */
export const formatPercent = (value: number, decimals = 2): string => {
  if (!Number.isFinite(value)) {
    return (0).toFixed(decimals);
  }
  return value.toFixed(decimals);
};
