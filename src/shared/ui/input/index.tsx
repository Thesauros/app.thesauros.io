import { ReactNode, useRef } from 'react';
import styles from './input.module.scss';
import classNames from 'classnames';

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
}: TProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onInputChange = () => {
    if (onChange && inputRef.current) {
      onChange(inputRef.current.value);
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
        value={value}
        className={classNames(
          styles.input,
          variant && styles[variant],
          !!error && styles.error,
          !!icon && styles.withIcon,
          className && className
        )}
        disabled={disabled}
        readOnly={readOnly}
        type={type}
        autoComplete={autoComplete}
      />
    </div>
  );
};
