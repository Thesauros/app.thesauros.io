import { InputComponent } from '@/shared/ui/input';
import styles from './Header.module.scss';
import { Controls } from './controls';
import { LoupeIcon } from '@/shared/ui/icons/loupe';
import { useState } from 'react';
import { useCheckResolution } from '@/shared/browser/useCheckResolution';

export const Header = () => {
  const [value, setValue] = useState('');
  const isMobile = useCheckResolution(576);
  return (
    <header className={styles.header}>
      {!isMobile && (
        <InputComponent
          value={value}
          type="string"
          placeholder="Search..."
          icon={<LoupeIcon />}
          onChange={setValue}
        />
      )}
      <Controls />
    </header>
  );
};
