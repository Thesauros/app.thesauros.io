import { useRouter } from 'next/router';
import { FlexBlock } from '../../flex-block';
import { MENU_ITEMS } from '../aside/menu/menuItems';
import { Tooltip } from '../../tooltip/tooltip';
import styles from './modal-container.module.scss';
import Link from 'next/link';

import { Texting } from '../../typography/texting';
import { useModal } from '../../modal';

export const ModalContainer = () => {
  const router = useRouter();
  const { close } = useModal();

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

  return (
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
            onClick={() => close()}
          >
            {item.icon}
            <Texting level={3}>{item.name}</Texting>
          </Link>
        );
      })}
    </FlexBlock>
  );
};
