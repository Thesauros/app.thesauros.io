import type { AppProps } from 'next/app';
import { Onest } from 'next/font/google';
import Script from 'next/script';

import '@shared/ui/ui-constants/globals.scss';
import '@shared/ui/ui-constants/design-system.scss';

import { Layout } from '@/shared/ui/layout';
import { ModalProvider } from '@/shared/ui/modal';
import ThemeProvider from '@/shared/ui/theme/theme.provider';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/shared/blockchain/config';
import { ReferralProvider } from '@/widgets/refferal';

const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;

const queryClient = new QueryClient();

const onest = Onest({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={onest.className}>
      {HOTJAR_ID && (
        <Script
          id="hotjar"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      )}
      <ThemeProvider>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider locale="en-US">
              <ModalProvider>
                <ReferralProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </ReferralProvider>
              </ModalProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </div>
  );
}
