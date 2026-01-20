import { useEffect, useMemo, useState } from 'react';
import { useAccount as useAccountWagmi, useWalletClient, usePublicClient } from 'wagmi';
import type { WalletClient, PublicClient, HttpTransport } from 'viem';
import { BrowserProvider, JsonRpcProvider, FallbackProvider } from 'ethers';
import { useNetwork } from './useNetwork';

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
  const { chain } = useNetwork();
  const [isInitialized, setIsInitialized] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(account.isConnected);
    setIsInitialized(true);
  }, [account.isConnected, chain]);

  const signer = useEthersSigner();
  const provider = useEthersProvider();

  return {
    ...account,
    isConnected: connected,
    isInitialized,
    signer,
    provider,
  };
};
