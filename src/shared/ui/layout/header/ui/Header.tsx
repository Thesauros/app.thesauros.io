import { InputComponent } from '@/shared/ui/input';
import styles from './Header.module.scss';
import { Controls } from './controls';
import { LoupeIcon } from '@/shared/ui/icons/loupe';
import { useState } from 'react';

export const Header = () => {
  const [value, setValue] = useState('');
  return (
    <header className={styles.header}>
      <InputComponent
        value={value}
        type="string"
        placeholder="Search..."
        icon={<LoupeIcon />}
        onChange={setValue}
      />
      <Controls />
    </header>
  );
};
