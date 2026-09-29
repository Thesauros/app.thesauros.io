import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import type { Abi } from 'viem';
import { useSwitchNetwork } from '@/shared/blockchain';
import { CROSSCHAIN } from '@/shared/blockchain/crosschain/config';

export type TTxState = 'idle' | 'switching' | 'signing' | 'confirming' | 'success' | 'error';

/**
 * Sends one transaction on the hub chain and waits for its receipt (unlike the
 * legacy flow, a returned hash is not treated as success). Switches the wallet
 * to Base first when needed and refreshes the cross-chain queries afterwards.
 */
export const useCrossChainTx = () => {
  const queryClient = useQueryClient();
  const { isNeedSwitch, switchNetworkAsync } = useSwitchNetwork({
    targetChainID: CROSSCHAIN.chainId,
  });
  const { writeContractAsync } = useWriteContract();
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [state, setState] = useState<TTxState>('idle');
  const [error, setError] = useState<string>('');

  const receipt = useWaitForTransactionReceipt({ hash, chainId: CROSSCHAIN.chainId });

  useEffect(() => {
    if (!hash) return;
    if (receipt.isSuccess) {
      setState(receipt.data.status === 'success' ? 'success' : 'error');
      if (receipt.data.status !== 'success') setError('Transaction reverted');
      queryClient.invalidateQueries({ queryKey: ['CROSSCHAIN_VAULT'] });
      queryClient.invalidateQueries({ queryKey: ['CROSSCHAIN_USER'] });
      queryClient.invalidateQueries({ queryKey: ['CROSSCHAIN_ALLOCATION'] });
      queryClient.invalidateQueries({ queryKey: ['CROSSCHAIN_ACTIVITY'] });
      queryClient.invalidateQueries({ queryKey: ['readContract'] });
    } else if (receipt.isError) {
      setState('error');
      setError(receipt.error?.message ?? 'Transaction failed');
    }
  }, [hash, receipt.isSuccess, receipt.isError, receipt.data, receipt.error, queryClient]);

  const send = useCallback(
    async (params: {
      address: `0x${string}`;
      abi: Abi;
      functionName: string;
      args: readonly unknown[];
    }) => {
      setError('');
      try {
        if (isNeedSwitch) {
          setState('switching');
          await switchNetworkAsync(CROSSCHAIN.chainId);
        }
        setState('signing');
        const h = await writeContractAsync({ ...params, chainId: CROSSCHAIN.chainId } as never);
        setHash(h);
        setState('confirming');
        return h;
      } catch (e) {
        setState('error');
        const message = e instanceof Error ? e.message : String(e);
        setError(message.split('\n')[0]);
        return undefined;
      }
    },
    [isNeedSwitch, switchNetworkAsync, writeContractAsync]
  );

  const reset = useCallback(() => {
    setHash(undefined);
    setState('idle');
    setError('');
  }, []);

  return {
    send,
    reset,
    hash,
    state,
    error,
    isBusy: state === 'switching' || state === 'signing' || state === 'confirming',
  };
};
