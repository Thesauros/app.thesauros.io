import { FlexBlock } from '@/shared/ui/flex-block';
import styles from './Footer.module.scss';
import Link from 'next/link';
import { TwitterIcon, TelegramIcon, DiscordIcon } from '@shared/ui/icons/media';
import { Texting } from '@/shared/ui/typography/texting';
import { LogoIcon } from '@/shared/ui/icons/logo';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <FlexBlock justifyContent="space-between" block>
        <FlexBlock direction="column" gap={16}>
          <LogoIcon size="s" />
          <FlexBlock gap={16}>
            <a
              href="https://x.com/thesauros_io"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <TwitterIcon />
            </a>
            <a
              href="https://discord.gg/TQHez89EAE"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <DiscordIcon />
            </a>
            <a
              href="https://t.me/thesauros_io"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <TelegramIcon />
            </a>
          </FlexBlock>
        </FlexBlock>
        <FlexBlock direction="column" gap={16}>
          <FlexBlock gap={40} alignItems="center" className={styles.docsLinksContainer}>
            <Link href="/privacy" target="_blank" className={styles.docLink}>
              <Texting level={3} weight="regular">
                Privacy Policy
              </Texting>
            </Link>
            <Link href="/terms" target="_blank" className={styles.docLink}>
              <Texting level={3} weight="regular">
                Terms of use
              </Texting>
            </Link>
          </FlexBlock>

          <Texting level={4} weight="regular" className={styles.footerCopyright}>
            © 2025 Thesauros. All Rights Reserved
          </Texting>
        </FlexBlock>
      </FlexBlock>
    </footer>
  );
};
