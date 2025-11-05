import * as SliderPrimitive from '@radix-ui/react-slider';
import styles from './slider.module.scss';
import classNames from 'classnames';

type TProps = {
  min?: number;
  max?: number;
  value: number;
  onChange?: (value: number) => void;
  step?: number;
  disabled?: boolean;
  className?: string;
};

export const Slider = ({
  min = 0,
  max = 100,
  value,
  onChange,
  step = 1,
  disabled = false,
  className = '',
}: TProps) => {
  const handleValueChange = (values: number[]) => {
    if (onChange && values[0] !== undefined) {
      onChange(values[0]);
    }
  };

  return (
    <div className={styles.wrapper}>
      <SliderPrimitive.Root
        className={classNames(styles.slider, disabled && styles.disabled, className)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        defaultValue={[value]}
        onValueChange={handleValueChange}
      >
        <SliderPrimitive.Track className={styles.track}>
          <SliderPrimitive.Range className={styles.trackFilled} />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={styles.thumb} />
      </SliderPrimitive.Root>
    </div>
  );
};
