import type { AppProps } from 'next/app';
import { Onest } from 'next/font/google';

import '@shared/ui/ui-constants/globals.scss';
import '@shared/ui/ui-constants/design-system.scss';

import { Layout } from '@/shared/ui/layout';
import { ModalProvider } from '@/shared/ui/modal';
import ThemeProvider from '@/shared/ui/theme/theme.provider';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

const onest = Onest({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={onest.className}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ModalProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ModalProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </div>
  );
}
