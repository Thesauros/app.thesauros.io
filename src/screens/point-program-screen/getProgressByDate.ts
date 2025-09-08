export const getProgressByDates = (
  startDateSec: number,
  endDateSec: number
): { value: number; max: number; remainingDays: number } => {
  const nowSec = Math.floor(Date.now() / 1000);

  if (endDateSec <= startDateSec) {
    return { value: 0, max: 0, remainingDays: 0 };
  }

  const max = endDateSec - startDateSec;

  const clampedNow = Math.min(Math.max(nowSec, startDateSec), endDateSec);
  const value = clampedNow - startDateSec;

  const remainingSeconds = Math.max(0, endDateSec - clampedNow);
  const remainingDays = Math.ceil(remainingSeconds / 86400);

  return { value, max, remainingDays };
};
