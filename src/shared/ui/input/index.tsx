import { ReactNode, useRef, useMemo } from 'react';
import styles from './input.module.scss';
import classNames from 'classnames';
import { formatNumberWithCommas } from '@/shared/number/formatNumberWithCommas';

type TProps = {
  value: string | number;
  type: 'string' | 'number' | 'email';
  disabled?: boolean;
  name?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  error?: boolean;
  className?: string;
  autoComplete?: 'off' | 'on';
  icon?: ReactNode;
  id: string;
  variant?: 'primary' | 'secondary';
  minValue?: number;
  maxValue?: number;
  prefix?: string;
  textAlign?: 'left' | 'center' | 'right';
};

const parseFormattedNumber = (value: string, prefix?: string): string => {
  let cleaned = value.trim();

  // Убираем префикс, если он есть
  if (prefix && cleaned.startsWith(prefix)) {
    cleaned = cleaned.slice(prefix.length).trim();
  }

  // Убираем все запятые
  cleaned = cleaned.replace(/,/g, '');

  // Оставляем только цифры, минус в начале и точку для десятичных
  // Но для целых чисел оставляем только цифры и минус
  cleaned = cleaned.replace(/[^\d-]/g, '');

  // Убираем минусы, кроме первого
  const minusCount = (cleaned.match(/-/g) || []).length;
  if (minusCount > 1) {
    cleaned = '-' + cleaned.replace(/-/g, '');
  }

  return cleaned;
};
export const InputComponent = ({
  disabled = false,
  name,
  onChange,
  onFocus,
  placeholder,
  readOnly,
  value,
  type,
  error = false,
  className,
  autoComplete = 'off',
  icon,
  id,
  variant = 'primary',
  minValue,
  maxValue,
  prefix,
  textAlign = 'left',
}: TProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const displayValue = useMemo(() => {
    if (type === 'number' && prefix) {
      if (value === '' || value === '-') {
        return String(value);
      }

      const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

      if (isNaN(numValue)) {
        return String(value);
      }

      const formatted = formatNumberWithCommas(numValue);
      return prefix + formatted;
    }
    return String(value);
  }, [value, type, prefix]);

  const handleClick = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onInputChange = () => {
    if (onChange && inputRef.current) {
      let newValue = inputRef.current.value;

      // Если есть префикс и тип number, парсим значение ПЕРЕД проверками
      if (type === 'number' && prefix) {
        newValue = parseFormattedNumber(newValue, prefix);
      }

      if (type === 'number' && (minValue !== undefined || maxValue !== undefined)) {
        if (minValue && (newValue === '' || newValue === '-')) {
          onChange(String(minValue));
          return;
        }

        if (newValue === '' || newValue === '-') {
          onChange(newValue);
          return;
        }

        const numValue = Number(newValue);

        if (isNaN(numValue)) {
          return;
        }

        if (maxValue !== undefined && numValue > maxValue) {
          return;
        }

        if (minValue !== undefined && numValue < minValue) {
          if (numValue >= 0) {
            const valueStr = String(Math.abs(numValue));
            const minStr = String(minValue);

            if (valueStr.length < minStr.length) {
              onChange(newValue);
              return;
            }
          }

          return;
        }
      }

      onChange(newValue);
    }
  };

  return (
    <div onClick={handleClick} className={styles.container}>
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <input
        ref={inputRef}
        aria-label={name}
        data-testid={name}
        tabIndex={0}
        id={id}
        name={name}
        onChange={onInputChange}
        onFocus={onFocus}
        placeholder={placeholder}
        value={displayValue}
        className={classNames(
          styles.input,
          variant && styles[variant],
          !!error && styles.error,
          !!icon && styles.withIcon,
          textAlign === 'center' && styles.textAlignCenter,
          textAlign === 'right' && styles.textAlignRight,
          className && className
        )}
        style={{ textAlign }}
        disabled={disabled}
        readOnly={readOnly}
        type={type === 'number' && prefix ? 'text' : type}
        inputMode={type === 'number' ? 'numeric' : undefined}
        autoComplete={autoComplete}
        min={minValue !== undefined ? minValue : undefined}
        max={maxValue !== undefined ? maxValue : undefined}
      />
    </div>
  );
};
