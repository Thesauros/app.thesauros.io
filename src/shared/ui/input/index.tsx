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
  numberPrefix?: string;
  prefix?: ReactNode;
  postfix?: ReactNode;
  textAlign?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md';
  fullWidth?: boolean;
};

const parseFormattedNumber = (value: string, numberPrefix?: string): string => {
  let cleaned = value.trim();

  // Убираем префикс, если он есть
  if (numberPrefix && cleaned.startsWith(numberPrefix)) {
    cleaned = cleaned.slice(numberPrefix.length).trim();
  }

  // Убираем все запятые
  cleaned = cleaned.replace(/,/g, '');

  // Оставляем только цифры и точку для десятичных (без минуса)
  cleaned = cleaned.replace(/[^\d.]/g, '');

  // Убираем точки, кроме первой
  const dotCount = (cleaned.match(/\./g) || []).length;
  if (dotCount > 1) {
    const firstDotIndex = cleaned.indexOf('.');
    cleaned =
      cleaned.slice(0, firstDotIndex + 1) + cleaned.slice(firstDotIndex + 1).replace(/\./g, '');
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
  numberPrefix,
  prefix,
  postfix,
  textAlign = 'left',
  size = 'sm',
  fullWidth = false,
}: TProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const displayValue = useMemo(() => {
    if (type === 'number' && numberPrefix) {
      if (value === '') {
        return String(value);
      }

      const valueStr = String(value);
      const hasTrailingDot = valueStr.endsWith('.');

      // Если значение заканчивается на точку, сохраняем исходное значение с точкой
      if (hasTrailingDot) {
        const cleanedValue = valueStr.replace(/,/g, '');
        const numValue = parseFloat(cleanedValue);

        if (!isNaN(numValue)) {
          // Форматируем целую часть с запятыми и добавляем точку
          const formatted = formatNumberWithCommas(numValue);
          return numberPrefix + formatted + '.';
        }
        return numberPrefix + valueStr;
      }

      const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

      if (isNaN(numValue)) {
        return String(value);
      }

      // Если есть десятичные знаки, сохраняем их
      const valueStrCleaned = String(value).replace(/,/g, '');
      if (valueStrCleaned.includes('.')) {
        const parts = valueStrCleaned.split('.');
        const integerPart = formatNumberWithCommas(parseFloat(parts[0]) || 0);
        const decimalPart = parts[1] || '';
        return numberPrefix + integerPart + '.' + decimalPart;
      }

      const formatted = formatNumberWithCommas(numValue);
      return numberPrefix + formatted;
    }
    return String(value);
  }, [value, type, numberPrefix]);

  const handleClick = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Блокируем ввод минуса для всех input с типом number
    if (type === 'number' && (e.key === '-' || e.key === 'Minus')) {
      e.preventDefault();
    }
  };

  const onInputChange = () => {
    if (onChange && inputRef.current) {
      let newValue = inputRef.current.value;

      // Если тип number, парсим значение (с префиксом или без)
      if (type === 'number') {
        if (numberPrefix) {
          newValue = parseFormattedNumber(newValue, numberPrefix);
        } else {
          // Парсим для случая без префикса - разрешаем только цифры и точку (без минуса)
          newValue = newValue.replace(/[^\d.]/g, '');

          // Убираем точки, кроме первой
          const dotCount = (newValue.match(/\./g) || []).length;
          if (dotCount > 1) {
            const firstDotIndex = newValue.indexOf('.');
            newValue =
              newValue.slice(0, firstDotIndex + 1) +
              newValue.slice(firstDotIndex + 1).replace(/\./g, '');
          }
        }
      }

      if (type === 'number' && (minValue !== undefined || maxValue !== undefined)) {
        if (minValue && newValue === '') {
          onChange(String(minValue));
          return;
        }

        if (newValue === '' || newValue === '.' || newValue.endsWith('.')) {
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
    <div
      onClick={handleClick}
      className={classNames(styles.container, fullWidth && styles.fullWidth)}
    >
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <div className={styles.inputWrapper}>
        {prefix ? <div className={styles.prefix}>{prefix}</div> : null}
        <input
          ref={inputRef}
          aria-label={name}
          data-testid={name}
          tabIndex={0}
          id={id}
          name={name}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          placeholder={placeholder}
          value={displayValue}
          className={classNames(
            styles.input,
            variant && styles[variant],
            size && styles[size],
            !!error && styles.error,
            !!icon && styles.withIcon,
            !!prefix && styles.withPrefix,
            !!postfix && styles.withPostfix,
            textAlign === 'center' && styles.textAlignCenter,
            textAlign === 'right' && styles.textAlignRight,
            fullWidth && styles.fullWidth,
            className && className
          )}
          style={{ textAlign }}
          disabled={disabled}
          readOnly={readOnly}
          type={type === 'number' ? 'text' : type}
          inputMode={type === 'number' ? 'decimal' : undefined}
          autoComplete={autoComplete}
          min={minValue !== undefined ? minValue : undefined}
          max={maxValue !== undefined ? maxValue : undefined}
        />
        {postfix ? <div className={styles.postfix}>{postfix}</div> : null}
      </div>
    </div>
  );
};
