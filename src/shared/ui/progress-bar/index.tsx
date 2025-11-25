import { useMemo, useState, useEffect, useRef } from 'react';
import styles from './ProgressBar.module.scss';
import { FlexBlock } from '../flex-block';
import { Higlight } from '../typography/highlight';
import classNames from 'classnames';
import { Caption } from '../new-typography/caption';

type TProps = {
  value: number | string;
  max?: number | string;
  width?: string | number;
  withValues?: boolean;
  filledAnimation?: boolean;
  showPercentage?: boolean;
  showRemainingDays?: boolean;
  remainingDays?: number;
  withGradient?: boolean;
  postfix?: string;
  valuePrefix?: string;
};

export const ProgressBar = ({
  value,
  max = 100,
  width = '100%',
  withValues = false,
  filledAnimation = true,
  showPercentage = false,
  showRemainingDays = false,
  remainingDays = 0,
  withGradient = false,
  postfix = '',
  valuePrefix = '',
}: TProps) => {
  const targetPct = useMemo(() => {
    return value === 0 ? 0 : (100.0 * Number(value)) / Number(max);
  }, [value, max]);

  const [progressPct, setProgressPct] = useState(filledAnimation ? 0 : targetPct);
  const [currentValue, setCurrentValue] = useState(filledAnimation ? 0 : Number(value));
  const [isVisible, setIsVisible] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    if (!filledAnimation) {
      setProgressPct(targetPct);
      setCurrentValue(Number(value));
      return;
    }

    setProgressPct(targetPct);

    let start: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / 3000, 1);

      setCurrentValue(Math.round(progress * Number(value)));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, targetPct, value, filledAnimation]);

  return (
    <FlexBlock direction="column" gap={16} ref={ref} block>
      {withValues && (
        <Caption weight="bold" className={styles.progressBarValue}>
          <Higlight>
            {valuePrefix}
            {currentValue}
          </Higlight>{' '}
          / {valuePrefix}
          {max} {postfix}
        </Caption>
      )}

      <div
        className={classNames(styles.root, {
          [styles.gradient]: withGradient,
        })}
        style={{ width: width }}
      >
        <div
          className={classNames(styles.bar, {
            [styles.gradient]: withGradient,
          })}
          style={{
            width: `${progressPct}%`,
            transition: filledAnimation ? `width 3000ms ease-out` : 'none',
          }}
        />
      </div>

      {(showPercentage || showRemainingDays) && (
        <FlexBlock justifyContent="space-between" className={styles.progressInfo}>
          {showPercentage && (
            <Caption weight="bold" className={styles.percentageText}>
              {Math.round(progressPct)}% Complete
            </Caption>
          )}
          {showRemainingDays && (
            <Caption weight="regular" className={styles.remainingDaysText}>
              {remainingDays} days remaining
            </Caption>
          )}
        </FlexBlock>
      )}
    </FlexBlock>
  );
};
