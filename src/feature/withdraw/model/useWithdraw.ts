import { TAddress, TArg, TChainID } from '../../../shared/blockchain/core/types';
import { useContractWrite } from '../../../shared/blockchain/core/useContractWrite';

export const useWithdraw = ({
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
    functionName: 'withdraw',
    chainID: chainID,
    args: args,
  });

  const withdraw = () => {
    write();
  };

  return { withdraw, isWithdrawingLoading: isLoading };
};
