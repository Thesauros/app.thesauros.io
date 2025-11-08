import { TAddress, TArg, TChainID } from '../../../shared/blockchain/core/types';
import { useContractWrite } from '../../../shared/blockchain/core/useContractWrite';

export const useWithdraw = ({
  vaultAddress,
  chainID,
  args,
  onSuccess,
  onError,
}: {
  vaultAddress: TAddress;
  chainID: TChainID;
  args: TArg[];
  onSuccess?: (data: `0x${string}`) => void;
  onError?: (error: Error | null) => void;
}) => {
  const { write, isLoading } = useContractWrite({
    address: vaultAddress,
    functionName: 'withdraw',
    chainID: chainID,
    args: args,
    onSuccess,
    onError,
  });

  const withdraw = (): void => {
    write();
  };

  return { withdraw, isWithdrawingLoading: isLoading };
};
