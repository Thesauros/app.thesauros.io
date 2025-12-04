import styles from './aside.module.scss';
import { useRouter } from 'next/router';
import { LogoIcon } from '@/shared/ui/icons/logo';
import { FlexBlock } from '../../flex-block';
import { MENU_ITEMS } from './menu/menuItems';
import { Tooltip } from '../../tooltip/tooltip';
import Link from 'next/link';
import { Subtitle } from '../../new-typography/subtitle';
import { PointProgramBanner } from '../../point-program-banner';

import { TelegramIcon } from '../../icons/telegram-icon';
import { TwitterIcon } from '../../icons/twitter-icon';
import { DiscordIcon } from '../../icons/discord-icon';
import { Overline } from '../../new-typography/overline';

const docsLinks = [
  {
    id: 'Documents',
    link: 'https://thesauros.gitbook.io/thesauros-docs',
  },
  {
    id: 'FAQ',
    link: 'https://thesauros.gitbook.io/thesauros-docs/other/faq',
  },
  {
    id: 'Terms & Conditions',
    link: 'https://thesauros.io/terms',
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
    link: 'https://discord.gg/TQHez89EAE',
    icon: <DiscordIcon />,
  },
];

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
      <FlexBlock direction="column" gap={16}>
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
          <FlexBlock direction="column" gap={0} block>
            {MENU_ITEMS.map(item => {
              const isActive = isActiveRoute(item.path);

              if (item.disabled) {
                return (
                  <Tooltip key={item.id} fullWidth tooltipText="Comming soon...">
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
      </FlexBlock>
      <FlexBlock direction="column" justifyContent="center" alignItems="center" gap={16} block>
        <FlexBlock gap={32} alignItems="center">
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
    </div>
  );
};
