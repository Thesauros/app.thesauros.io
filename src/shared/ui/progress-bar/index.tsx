import { useMemo, useState, useEffect, useRef } from 'react';
import styles from './ProgressBar.module.scss';
import { Texting } from '../typography/texting';
import { FlexBlock } from '../flex-block';
import { Higlight } from '../typography/highlight';
import classNames from 'classnames';

type TProps = {
  value: number | string;
  max?: number | string;
  width?: string | number;
  withValues?: boolean;
  filledAnimation?: boolean;
};

export const ProgressBar = ({
  value,
  max = 100,
  width = '100%',
  withValues = false,
  filledAnimation = true,
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
    <FlexBlock direction="column" gap={8} ref={ref}>
      {withValues && (
        <Texting level={3} className={styles.progressBarValue}>
          <Higlight>{currentValue}</Higlight> / {max}
        </Texting>
      )}
      <div className={styles.root} style={{ width }}>
        <div
          className={classNames(styles.bar)}
          style={{
            width: `${progressPct}%`,
            transition: filledAnimation ? `width 3000ms ease-out` : 'none',
          }}
        />
      </div>
    </FlexBlock>
  );
};
