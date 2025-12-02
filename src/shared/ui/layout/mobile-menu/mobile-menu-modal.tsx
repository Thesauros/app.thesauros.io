import { useRouter } from 'next/router';
import { FlexBlock } from '../../flex-block';
import { MENU_ITEMS } from '../aside/menu/menuItems';
import { Tooltip } from '../../tooltip/tooltip';
import styles from './mobile-menu-modal.module.scss';
import Link from 'next/link';

import { useModal } from '../../modal';
import { LogoIcon } from '../../icons/logo';
import { ModalCloseIcon } from './modal-close-icon';
import { Subtitle } from '../../new-typography/subtitle';
import { PointProgramBanner } from '../../point-program-banner';
import { TwitterIcon } from '../../icons/twitter-icon';
import { DiscordIcon } from '../../icons/discord-icon';
import { TelegramIcon } from '../../icons/telegram-icon';
import { Overline } from '../../new-typography/overline';

const docsLinks = [
  {
    id: 'Documents',
    link: '/docs',
  },
  {
    id: 'FAQ',
    link: '/faq',
  },
  {
    id: 'Terms & Conditions',
    link: '/terms',
  },
];

const socialLinks = [
  {
    id: 'telegram',
    link: 'https://t.me/+p9DRrmX7ou05ODUy',
    icon: <TelegramIcon />,
  },
  {
    id: 'twitter',
    link: 'https://x.com/thesauros_io',
    icon: <TwitterIcon />,
  },
  {
    id: 'discord',
    link: 'https://discord.gg/WJgvrrr2',
    icon: <DiscordIcon />,
  },
];

export const MobileMenuModal = () => {
  const router = useRouter();
  const { close } = useModal();

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <FlexBlock direction="column" gap={24}>
      <FlexBlock justifyContent="space-between" alignItems="center">
        <LogoIcon size="m" />
        <ModalCloseIcon onClick={close} />
      </FlexBlock>
      <FlexBlock direction="column" gap={0} block>
        {MENU_ITEMS.map(item => {
          const isActive = isActiveRoute(item.path);

          if (item.disabled) {
            return (
              <Tooltip key={item.id} tooltipText="Comming soon...">
                <div className={`${styles.menuItem} ${styles.disabled}`} role="presentation">
                  {item.icon}
                  <Subtitle level={2} weight="bold">
                    {item.name}
                  </Subtitle>
                </div>
              </Tooltip>
            );
          }

          return (
            <Link
              href={item.path}
              onClick={close}
              className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
              key={item.id}
            >
              {item.icon}
              <Subtitle level={2}>{item.name}</Subtitle>
            </Link>
          );
        })}
      </FlexBlock>
      <PointProgramBanner />
      <FlexBlock direction="column" justifyContent="center" alignItems="center" gap={16} block>
        <FlexBlock gap={24} alignItems="center">
          {socialLinks.map(link => (
            <a
              href={link.link}
              key={`${link.id}-socialink`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.icon}
            </a>
          ))}
        </FlexBlock>
        <FlexBlock direction="column" gap={8} alignItems="center" justifyContent="center">
          <FlexBlock gap={8}>
            {docsLinks.map(link => (
              <a
                href={link.link}
                className={styles.link}
                key={`${link.id}-doclink`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Overline weight="regular" className={styles.secondary}>
                  {link.id}
                </Overline>
              </a>
            ))}
          </FlexBlock>
          <Overline weight="regular" className={styles.secondary}>
            ©Thesauros 2025
          </Overline>
        </FlexBlock>
      </FlexBlock>
    </FlexBlock>
  );
};
