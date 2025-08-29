import styles from './aside.module.scss';
import { useRouter } from 'next/router';
import { LogoIcon } from '@/shared/ui/icons/logo';
import { FlexBlock } from '../../flex-block';
import { MENU_ITEMS } from './menu/menuItems';
import { Texting } from '../../typography/texting';

export const Aside = () => {
  const router = useRouter();

  return (
    <div className={styles.aside}>
      <div
        role="presentation"
        className={styles.logo}
        onClick={() => {
          router.push('/');
          window.location.hash = '';
          document.body?.scrollTo(0, 0);
        }}
      >
        <LogoIcon />
      </div>
      <FlexBlock direction="column" gap={12}>
        {MENU_ITEMS.map(item => (
          <div className={styles.menuItem} key={item.id}>
            {item.icon}
            <Texting level={3}>{item.name}</Texting>
          </div>
        ))}
      </FlexBlock>
    </div>
  );
};
