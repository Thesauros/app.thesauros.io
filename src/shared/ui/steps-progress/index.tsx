import classNames from 'classnames';
import styles from './steps-progress.module.scss';
import { FlexBlock } from '../flex-block';

export type StepStatus = 'completed' | 'active' | 'pending';

export type Step = {
  label: string;
  status: StepStatus;
};

type TProps = {
  steps: Step[];
  className?: string;
};

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 3L4.5 8.5L2 6"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const StepsProgress = ({ steps, className }: TProps) => {
  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.stepsContainer}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={classNames(styles.stepContainer, {
              [styles.last]: index === steps.length - 1,
              [styles.first]: index === 0,
            })}
          >
            <div key={index} className={styles.stepItem}>
              <div
                className={classNames(styles.stepCircle, {
                  [styles.completed]: step.status === 'completed',
                  [styles.active]: step.status === 'active',
                  [styles.pending]: step.status === 'pending',
                })}
              >
                {step.status === 'completed' && <CheckIcon />}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={styles.progressLine}>
                <div className={styles.progressTrack} />
                <div
                  className={styles.progressFill}
                  style={{
                    width:
                      step.status === 'completed'
                        ? '100%'
                        : step.status === 'active'
                          ? '50%'
                          : '0%',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <FlexBlock gap={4} justifyContent="space-between" alignItems="center">
        {steps.map((step, index) => (
          <div key={index}>
            <span
              className={classNames(styles.stepLabel, {
                [styles.completedLabel]: step.status === 'completed',
                [styles.activeLabel]: step.status === 'active',
                [styles.pendingLabel]: step.status === 'pending',
              })}
            >
              {step.label}
            </span>
          </div>
        ))}
      </FlexBlock>
    </div>
  );
};
