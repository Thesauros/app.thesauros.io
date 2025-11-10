import styles from './switch-toggle.module.scss';

export const SwitchToggle = ({
  active,
  onSelect,
  values,
}: {
  active: { title: string; value: number };
  onSelect: (period: { title: string; value: number }) => void;
  values: { title: string; value: number }[];
}) => {
  return (
    <div className={styles.container}>
      {values.map(value => (
        <button
          key={value.title}
          className={`${styles.button} ${active.value === value.value ? styles.active : ''}`}
          onClick={() => onSelect(value)}
        >
          {value.title}
        </button>
      ))}
    </div>
  );
};
