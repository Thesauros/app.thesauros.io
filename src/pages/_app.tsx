import type { AppProps } from 'next/app';
import { Onest } from 'next/font/google';
import Head from 'next/head';

import '@shared/ui/ui-constants/globals.scss';
import '@shared/ui/ui-constants/design-system.scss';

import { Layout } from '@/shared/ui/layout';
import { LanguageProvider } from '@/shared/i18n/LanguageProvider';
import { ModalProvider } from '@/shared/ui/modal';
import ThemeProvider from '@/shared/ui/theme/theme.provider';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/shared/blockchain/config';
import { ReferralProvider } from '@/widgets/referral';
import { AppInitializer } from '@/shared/providers';

const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;

const onest = Onest({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      })
  );

  return (
    <div className={onest.className}>
      {HOTJAR_ID && (
        <Head>
          <script src={`https://t.contentsquare.net/uxa/${HOTJAR_ID}.js`} />
        </Head>
      )}
      <LanguageProvider>
        <ThemeProvider>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider locale="en-US">
                <ModalProvider>
                  <ReferralProvider>
                    <AppInitializer>
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                    </AppInitializer>
                  </ReferralProvider>
                </ModalProvider>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ThemeProvider>
      </LanguageProvider>
    </div>
  );
}
