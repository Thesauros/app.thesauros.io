import styles from './aside.module.scss';
import { useRouter } from 'next/router';
import { LogoIcon } from '@/shared/ui/icons/logo';
import { FlexBlock } from '../../flex-block';
import { MENU_ITEMS } from './menu/menuItems';
import { Tooltip } from '../../tooltip/tooltip';
import Link from 'next/link';
import { Subtitle } from '../../new-typography/subtitle';
import { PointProgramBanner } from '../../point-program-banner';

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
      <FlexBlock gap={24} direction="column">
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
        <FlexBlock direction="column">
          {MENU_ITEMS.map(item => {
            const isActive = isActiveRoute(item.path);

            if (item.disabled) {
              return (
                <Tooltip key={item.id} tooltipText="Comming soon...">
                  <div className={`${styles.menuItem} ${styles.disabled}`} role="presentation">
                    {item.icon}
                    <Subtitle level={2}>{item.name}</Subtitle>
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
                <Subtitle level={2}>{item.name}</Subtitle>
              </Link>
            );
          })}
        </FlexBlock>
      </FlexBlock>
      <PointProgramBanner />
    </div>
  );
};
