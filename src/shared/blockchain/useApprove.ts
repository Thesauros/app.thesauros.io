import { useEffect, useMemo } from 'react';
import { TAddress, TChainID } from './core/types';
import { useContractWrite } from './core/useContractWrite';
import { useAccount } from 'wagmi';
import { useAllowance } from './useAllowance';
import { useQueryClient } from '@tanstack/react-query';

type TUseApproveProps = {
  tokenAddress: TAddress;
  userValue: number;
  vaultAddress: TAddress;

  chainID: TChainID;
};

export const useApprove = ({
  tokenAddress,
  vaultAddress,
  userValue,
  chainID,
}: TUseApproveProps) => {
  const { address: userAddress } = useAccount();

  const {
    write,
    isLoading: isLoadingApprove,
    isSuccess,
    error,
    isError,
  } = useContractWrite({
    address: tokenAddress,
    chainID: chainID,
    functionName: 'approve',
    args: [vaultAddress, BigInt(Math.floor(userValue))],
  });

  const queryClient = useQueryClient();
  const {
    allowance,
    isLoading: isLoadingAllowance,
    refetch: refetchAllowance,
  } = useAllowance({
    tokenAddress: tokenAddress,
    tokenChainId: chainID,
    account: userAddress,
    spender: vaultAddress,
  });

  // Invalidate allowance cache after successful approve
  useEffect(() => {
    if (isSuccess) {
      // Try multiple times to ensure transaction is confirmed and allowance is updated
      const refetchAllowanceData = () => {
        refetchAllowance();
        // Also invalidate all readContract queries to ensure fresh data
        queryClient.invalidateQueries({ queryKey: ['readContract'] });
      };

      // Immediate refetch (transaction might be confirmed already)
      refetchAllowanceData();

      // Refetch after 1 second
      const timer1 = setTimeout(refetchAllowanceData, 1000);
      // Refetch after 2 seconds
      const timer2 = setTimeout(refetchAllowanceData, 2000);
      // Refetch after 5 seconds (transaction should be confirmed by now)
      const timer3 = setTimeout(refetchAllowanceData, 5000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isSuccess, refetchAllowance, queryClient]);

  const isApproved: boolean = useMemo(() => {
    const userInputValue = Number.isNaN(Number(userValue)) ? 0 : Math.floor(Number(userValue));

    if (typeof allowance === 'bigint') {
      return allowance >= BigInt(userInputValue);
    } else {
      return false;
    }
  }, [allowance, userValue]);

  return {
    approve: write,
    isApproved,
    isLoading: isLoadingApprove || isLoadingAllowance,
    isSuccess,
    isError,
    error,
  };
};
