import { useMemo } from 'react';
import { TAddress, TChainID } from './core/types';
import { useContractWrite } from './core/useContractWrite';
import { round } from '../number/round';
import { useAllowance } from './useAllowance';
import { useAccount } from './useAccount';

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
    args: [vaultAddress, BigInt(Math.round(userValue))],
  });

  const { allowance, isLoading: isLoadingAllowance } = useAllowance({
    tokenAddress: tokenAddress,
    tokenChainId: chainID,
    account: userAddress,
    spender: vaultAddress,
  });

  const isApproved: boolean = useMemo(() => {
    const userInputValue = Number.isNaN(Number(userValue)) ? 0 : round(Number(userValue));

    if (typeof allowance === 'bigint') {
      return allowance >= userInputValue;
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
