import { TAddress, TArg, TChainID } from '../../../shared/blockchain/core/types';
import { useContractWrite } from '../../../shared/blockchain/core/useContractWrite';

export const useDeposit = ({
  vaultAddress,
  chainID,
  args,
}: {
  vaultAddress: TAddress;
  chainID: TChainID;
  args: TArg[];
}) => {
  const { write, isLoading } = useContractWrite({
    address: vaultAddress,
    functionName: 'deposit',
    chainID: chainID,
    args: args,
  });

  const deposit = () => {
    write();
  };

  return { deposit, isDepositLoading: isLoading };
};
