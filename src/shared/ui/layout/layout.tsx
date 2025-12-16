import { ReactNode } from 'react';
import { Header } from './header';
import { PageContainer } from './page-container';
import styles from './layout.module.scss';
import { Aside } from './aside';
import { FlexBlock } from '../flex-block';
import { useAutoSwitchToNetwork } from '@/shared/blockchain/useAutoSwitchToNetwork';
import { useRequireSignature } from '@/feature/sign-terms';

type TProps = {
  children: ReactNode;
};

export const Layout = ({ children }: TProps) => {
  useAutoSwitchToNetwork({ targetChainID: 8453 });
  useRequireSignature();

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
