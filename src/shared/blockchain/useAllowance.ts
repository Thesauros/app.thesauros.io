import { TAddress, TChainID } from './core/types';
import { useContractRead } from './core/useContractRead';

type TAllowanceProps = {
  tokenAddress: TAddress;
  tokenChainId: TChainID;
  account?: TAddress;
  spender: TAddress;
};

export const useAllowance = ({ tokenAddress, tokenChainId, account, spender }: TAllowanceProps) => {
  const {
    data: allowance,
    isLoading,
    refetch,
  } = useContractRead({
    address: tokenAddress,
    chainID: tokenChainId,
    functionName: 'allowance',
    watch: false,
    args: [account, spender],
  });

  return {
    allowance,
    isLoading,
    refetch,
  };
};
