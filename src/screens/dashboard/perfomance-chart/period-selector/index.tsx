import { Card } from '@/shared/ui/card';
import styles from './period-selector.module.scss';

export const PeriodSelector = ({
  activePeriod,
  onPeriodSelect,
}: {
  activePeriod: string;
  onPeriodSelect: (period: string) => void;
}) => {
  return (
    <Card className={styles.timeRangeSelector}>
      {['7D', '30D', '6M', '1Y'].map(period => (
        <button
          key={period}
          className={`${styles.timeRangeButton} ${activePeriod === period ? styles.active : ''}`}
          onClick={() => onPeriodSelect(period)}
        >
          {period}
        </button>
      ))}
    </Card>
  );
};
