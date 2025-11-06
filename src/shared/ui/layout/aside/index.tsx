import styles from './aside.module.scss';
import { useRouter } from 'next/router';
import { LogoIcon } from '@/shared/ui/icons/logo';
import { FlexBlock } from '../../flex-block';
import { MENU_ITEMS } from './menu/menuItems';
import { Texting } from '../../typography/texting';
import { Tooltip } from '../../tooltip/tooltip';
import Link from 'next/link';

export const Aside = () => {
  const router = useRouter();

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

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
        {MENU_ITEMS.map(item => {
          const isActive = isActiveRoute(item.path);

          if (item.disabled) {
            return (
              <Tooltip key={item.id} tooltipText="Comming soon...">
                <div className={`${styles.menuItem} ${styles.disabled}`} role="presentation">
                  {item.icon}
                  <Texting level={3}>{item.name}</Texting>
                </div>
              </Tooltip>
            );
          }

          return (
            <Link
              href={item.path}
              className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
              key={item.id}
            >
              {item.icon}
              <Texting level={3}>{item.name}</Texting>
            </Link>
          );
        })}
      </FlexBlock>
    </div>
  );
};
