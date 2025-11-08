import { TAddress, TArg, TChainID } from '../../../shared/blockchain/core/types';
import { useContractWrite } from '../../../shared/blockchain/core/useContractWrite';

export const useDeposit = ({
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
    functionName: 'deposit',
    chainID: chainID,
    args: args,
    onSuccess,
    onError,
  });

  const deposit = () => {
    write();
  };

  return { deposit, isDepositLoading: isLoading };
};
