import styles from './aside.module.scss';
import { useRouter } from 'next/router';
import { LogoIcon } from '@/shared/ui/icons/logo';
import { FlexBlock } from '../../flex-block';
import { MENU_ITEMS } from './menu/menuItems';
import { Tooltip } from '../../tooltip/tooltip';
import Link from 'next/link';
import { Subtitle } from '../../new-typography/subtitle';
import { PointProgramBanner } from '../../point-program-banner';
import { DocIcon } from '../../icons/DocIcon';
import { MessageQuestion } from '../../icons/message-question';
import { FileCheck } from '../../icons/file-check';
import { Caption } from '../../new-typography/caption';
import { TelegramIcon } from '../../icons/telegram-icon';
import { TwitterIcon } from '../../icons/twitter-icon';
import { DiscordIcon } from '../../icons/discord-icon';

const docsLinks = [
  {
    id: 'Docs',
    link: '/docs',
    icon: <DocIcon />,
  },
  {
    id: 'FAQ',
    link: '/faq',
    icon: <MessageQuestion />,
  },
  {
    id: 'Terms',
    link: '/terms',
    icon: <FileCheck />,
  },
];

const socialLinks = [
  {
    id: 'telegram',
    link: 'https://t.me/thesauros_io',
    icon: <TelegramIcon />,
  },
  {
    id: 'twitter',
    link: 'https://x.com/thesauros_io',
    icon: <TwitterIcon />,
  },
  {
    id: 'discord',
    link: 'https://discord.com/invite/thesauros',
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
      <FlexBlock direction="column" gap={32}>
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
      </FlexBlock>
      <FlexBlock direction="column" justifyContent="center" alignItems="center" gap={16} block>
        <div className={styles.docsLinksContainer}>
          {docsLinks.map(link => (
            <a
              href={link.link}
              className={styles.link}
              key={`${link.id}-doclink`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FlexBlock alignItems="center" gap={4}>
                {link.icon}
                <Caption weight="regular">{link.id}</Caption>
              </FlexBlock>
            </a>
          ))}
        </div>
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
        <Caption weight="regular">©Thesauros 2025</Caption>
      </FlexBlock>
    </div>
  );
};
