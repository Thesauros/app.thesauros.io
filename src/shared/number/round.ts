export const round = (value: number, decimals = 2): number => {
  if (isNaN(value)) {
    return 0;
  }
  return Math.trunc(value * 10 ** decimals) / 10 ** decimals;
};
