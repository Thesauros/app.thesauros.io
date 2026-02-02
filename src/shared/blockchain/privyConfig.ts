import type { PrivyClientConfig } from '@privy-io/react-auth';
import { mainnet, arbitrum, base } from 'viem/chains';

export const privyConfig: PrivyClientConfig = {
  appearance: {
    walletList: [
      'metamask',
      'rainbow',
      'wallet_connect',
      'coinbase_wallet',
      'detected_ethereum_wallets',
    ],
    theme: 'light',
    accentColor: '#676FFF',
  },

  loginMethods: ['wallet', 'email', 'sms'],
  supportedChains: [mainnet, arbitrum, base],
  legal: {
    termsAndConditionsUrl: 'https://thesauros.tech/privacy',
    privacyPolicyUrl: 'https://thesauros.tech/privacy',
  },
};
