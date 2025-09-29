import { Card } from '@/shared/ui/card';
import styles from './period-selector.module.scss';

export const PeriodSelector = ({
  activePeriod,
  onPeriodSelect,
  periods,
}: {
  activePeriod: { title: string; value: number };
  onPeriodSelect: (period: { title: string; value: number }) => void;
  periods: { title: string; value: number }[];
}) => {
  return (
    <Card className={styles.timeRangeSelector}>
      {periods.map(period => (
        <button
          key={period.title}
          className={`${styles.timeRangeButton} ${activePeriod.value === period.value ? styles.active : ''}`}
          onClick={() => onPeriodSelect(period)}
        >
          {period.title}
        </button>
      ))}
    </Card>
  );
};
