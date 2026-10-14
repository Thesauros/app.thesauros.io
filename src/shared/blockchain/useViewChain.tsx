import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAccount } from 'wagmi';
import { DEFAULT_VAULT_INDEX, getSupportedChainIds, vaults } from './config';

const VIEW_CHAIN_STORAGE_KEY = 'viewChainId';

const DEFAULT_VIEW_CHAIN_ID = vaults[DEFAULT_VAULT_INDEX].chainID;

type TViewChainContext = {
  viewChainId: number;
  setViewChainId: (chainId: number) => void;
};

const ViewChainContext = createContext<TViewChainContext>({
  viewChainId: DEFAULT_VIEW_CHAIN_ID,
  setViewChainId: () => {},
});

const isSupported = (chainId: number | undefined): chainId is number =>
  chainId !== undefined && getSupportedChainIds().includes(chainId);

const readStoredViewChainId = (): number | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const stored = Number(window.localStorage.getItem(VIEW_CHAIN_STORAGE_KEY));
  return isSupported(stored) ? stored : undefined;
};

/**
 * The chain the user is *looking at*, which is deliberately kept separate from
 * the chain the wallet is connected to. All vault data is read through public
 * RPCs, so browsing another network needs no wallet interaction — asking the
 * wallet to switch would bounce mobile users into their wallet app for nothing.
 * The wallet is only asked to switch right before a transaction is signed
 * (see the deposit/withdraw modals).
 */
export const ViewChainProvider = ({ children }: { children: ReactNode }) => {
  const { chainId: walletChainId } = useAccount();
  const [viewChainId, setViewChainIdState] = useState(DEFAULT_VIEW_CHAIN_ID);
  const lastWalletChainIdRef = useRef<number | undefined>(undefined);
  const hasSeenWalletChainRef = useRef(false);

  // Restore the previous selection after the first client render, so that the
  // server-rendered markup and the initial hydration agree on the default.
  useEffect(() => {
    const stored = readStoredViewChainId();
    if (stored !== undefined) {
      setViewChainIdState(stored);
    }
  }, []);

  const setViewChainId = useCallback((chainId: number) => {
    if (!isSupported(chainId)) {
      return;
    }

    setViewChainIdState(chainId);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(VIEW_CHAIN_STORAGE_KEY, String(chainId));
    }
  }, []);

  useEffect(() => {
    if (walletChainId === undefined) {
      return;
    }

    // First time we learn the wallet's chain: adopt it only if the user has
    // never picked one, so a stored selection survives a page reload.
    if (!hasSeenWalletChainRef.current) {
      hasSeenWalletChainRef.current = true;
      lastWalletChainIdRef.current = walletChainId;

      if (readStoredViewChainId() === undefined) {
        setViewChainId(walletChainId);
      }
      return;
    }

    // Afterwards, follow the wallet whenever *it* changes network (from inside
    // the wallet app, or after a pre-transaction switch) — but never the other
    // way round: an in-app selection must not trigger a wallet request.
    if (lastWalletChainIdRef.current !== walletChainId) {
      lastWalletChainIdRef.current = walletChainId;
      setViewChainId(walletChainId);
    }
  }, [walletChainId, setViewChainId]);

  const value = useMemo(() => ({ viewChainId, setViewChainId }), [viewChainId, setViewChainId]);

  return <ViewChainContext.Provider value={value}>{children}</ViewChainContext.Provider>;
};

export const useViewChain = () => useContext(ViewChainContext);
