import styles from './badge.module.scss';

export const Badge = ({ label }: { label: string }) => {
  return (
    <div className={styles.container}>
      <p className={styles.label}>{label}</p>
    </div>
  );
};
