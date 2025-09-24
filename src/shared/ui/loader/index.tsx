import styles from './loader.module.scss';

export const Loader = () => {
  return (
    <div className={styles.container}>
      <span className={styles.loader} />
    </div>
  );
};
