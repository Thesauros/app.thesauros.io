import type { AppProps } from 'next/app';
import { Onest } from 'next/font/google';

import '@shared/ui/ui-constants/globals.scss';
import '@shared/ui/ui-constants/design-system.scss';

import { Layout } from '@/shared/ui/layout';
import { ModalProvider } from '@/shared/ui/modal';
import ThemeProvider from '@/shared/ui/theme/theme.provider';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'thesauros',
  projectId: 'c251732975350cbb92d74a64f88273c0',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

const queryClient = new QueryClient();

const onest = Onest({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={onest.className}>
      <ThemeProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <ModalProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ModalProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </div>
  );
}
