import { useEffect, useMemo, useRef } from 'react';
import { useAccount as useAccountWagmi, useWalletClient, usePublicClient } from 'wagmi';
import type { WalletClient, PublicClient, HttpTransport } from 'viem';
import { BrowserProvider, JsonRpcProvider, FallbackProvider } from 'ethers';
import { usePrivy, useWallets, useCreateWallet } from '@privy-io/react-auth';

function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = chain
    ? {
        chainId: chain.id,
        name: chain.name,
      }
    : undefined;
  const provider = new BrowserProvider(transport, network);
  return provider.getSigner(account?.address);
}

function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}

function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = chain
    ? {
        chainId: chain.id,
        name: chain.name,
      }
    : undefined;

  if (transport.type === 'fallback') {
    return new FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new JsonRpcProvider(value?.url, network)
      )
    );
  }

  const url = (transport as unknown as { value?: { url?: string } }).value?.url;
  return new JsonRpcProvider(url, network);
}

function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId });
  return useMemo(
    () => (publicClient ? publicClientToProvider(publicClient) : undefined),
    [publicClient]
  );
}

export const useAccount = () => {
  const account = useAccountWagmi();
  const { authenticated, ready: privyReady, login, logout, user } = usePrivy();
  const { wallets } = useWallets();

  const { createWallet } = useCreateWallet();

  const isCreatingRef = useRef(false);

  // Derived state — вычисляем напрямую без useEffect
  const connected = account.isConnected || authenticated;
  const isInitialized = privyReady;

  // Automatically create embedded wallet if user is authenticated and doesn't have a wallet
  useEffect(() => {
    let isMounted = true;

    const createEmbeddedWallet = async () => {
      // Check that:
      // 1. Privy is ready
      // 2. User is authenticated
      // 3. No external wallet from wagmi
      // 4. No embedded wallets from Privy
      // 5. Not in the process of creating (ref для синхронной проверки)
      if (
        privyReady &&
        authenticated &&
        !account.address &&
        wallets.length === 0 &&
        !isCreatingRef.current
      ) {
        isCreatingRef.current = true;
        try {
          await createWallet();
        } catch (error) {
          // Ignore error if wallet already created
          if (error instanceof Error && !error.message.includes('already has an embedded wallet')) {
            console.error('Failed to create embedded wallet:', error);
          }
        } finally {
          if (isMounted) {
            isCreatingRef.current = false;
          }
        }
      }
    };

    createEmbeddedWallet();

    return () => {
      isMounted = false;
    };
  }, [privyReady, authenticated, account.address, wallets.length, createWallet]);

  const signer = useEthersSigner();
  const provider = useEthersProvider();

  const walletAddress = useMemo(() => {
    if (account.address) {
      return account.address;
    }

    if (authenticated && wallets.length > 0) {
      const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy');

      if (embeddedWallet?.address) {
        return embeddedWallet.address as `0x${string}`;
      }

      if (wallets[0]?.address) {
        return wallets[0].address as `0x${string}`;
      }
    }

    return undefined;
  }, [account.address, authenticated, wallets]);

  return {
    ...account,
    address: walletAddress,
    isConnected: connected,
    isReady: privyReady,
    isInitialized,
    // authenticated with Privy
    authenticated,
    user,

    // methods to manage connection
    login,
    logout,

    // Ethers providers (legacy)
    signer,
    provider,
  };
};
