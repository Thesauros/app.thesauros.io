import { useEffect, useMemo, useState } from 'react';
import { useAccount as useAccountWagmi, useWalletClient, usePublicClient } from 'wagmi';
import type { WalletClient, PublicClient, HttpTransport } from 'viem';
import { providers } from 'ethers';
import { useNetwork } from './useNetwork';

function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = chain
    ? {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
      }
    : undefined;
  const provider = new providers.Web3Provider(transport, network);
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
        ensAddress: chain.contracts?.ensRegistry?.address,
      }
    : undefined;

  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    );
  return new providers.JsonRpcProvider(transport.url, network);
}

function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId });
  return useMemo(
    () => (publicClient ? publicClientToProvider(publicClient) : providers.FallbackProvider),
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
