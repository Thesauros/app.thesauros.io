import { ReactNode } from 'react';
import { Header } from './header';
import { PageContainer } from './page-container';
import { Footer } from './footer';
import styles from './layout.module.scss';
import { Aside } from './aside';

type TProps = {
  children: ReactNode;
};

export const Layout = ({ children }: TProps) => {
  return (
    <div className={styles.layout}>
      <Aside />
      <div className={styles.content}>
        <Header />
        <PageContainer>{children}</PageContainer>
        <Footer />
      </div>
    </div>
  );
};
