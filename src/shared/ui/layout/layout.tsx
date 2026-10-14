import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { Header } from './header';
import { PageContainer } from './page-container';
import styles from './layout.module.scss';
import { Aside } from './aside';
import { FlexBlock } from '../flex-block';

type TProps = {
  children: ReactNode;
};

/**
 * Routes that bring their own chrome.
 *
 * The shell below is a fixed 100dvh frame with the scrolling inside PageContainer, which is
 * right for the signed-in dashboard and wrong for a public page: a shared link has to scroll
 * as a document, with no side menu and no wallet controls.
 */
const BARE_ROUTES = new Set(['/live']);

export const Layout = ({ children }: TProps) => {
  const { pathname } = useRouter();

  if (BARE_ROUTES.has(pathname)) return <>{children}</>;

  return (
    <FlexBlock direction="column" block>
      <div className={styles.layout}>
        <Aside />
        <div className={styles.content}>
          <Header />
          <PageContainer>{children}</PageContainer>
        </div>
      </div>
    </FlexBlock>
  );
};
