import Link from 'next/link';
import { LogoIcon } from '@/shared/ui/icons/logo';
import { Caption } from '@/shared/ui/new-typography/caption';
import { CrossChainScreen } from '@/screens/crosschain-screen';
import styles from './live.module.scss';

/**
 * The public, read-only view of the cross-chain vault.
 *
 * Renders outside the app shell (see BARE_ROUTES in shared/ui/layout/layout.tsx) so that a
 * shared link opens as an ordinary scrolling page with no side menu and no wallet prompt. The
 * visualisation itself is the same component the signed-in app uses; the only difference is
 * that without a connected wallet it shows no action panel and no personal position.
 */
export const LiveScreen = () => (
  <div className={styles.page}>
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/main" className={styles.brand} aria-label="Thesauros">
          <LogoIcon size="m" />
        </Link>
        <Link href="/crosschain" className={styles.openApp}>
          Open the app
        </Link>
      </div>
    </header>

    <main className={styles.inner}>
      <CrossChainScreen />
    </main>

    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Caption className={styles.footNote}>
          Thesauros cross-chain USDC vault. Figures are read from Base and Arbitrum and refresh
          automatically; nothing on this page requires an account or a wallet.
        </Caption>
      </div>
    </footer>
  </div>
);
