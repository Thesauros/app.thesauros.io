import styles from './Header.module.scss';
import { Controls } from './controls';

export const Header = () => {
  return (
    <header className={styles.header}>
      <Controls />
    </header>
  );
};
