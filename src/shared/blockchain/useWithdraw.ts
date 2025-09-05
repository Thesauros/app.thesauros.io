import { TAddress, TChainID } from './core/types';
import { useContractWrite } from './core/useContractWrite';

export const useWithdraw = ({
  vaultAddress,
  chainID,
  args = [100, 'userAdress', 'userAdress'],
}: {
  vaultAddress: TAddress;
  chainID: TChainID;
  args: (string | number)[];
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

  return { withdraw, isWithdrawLoading: isLoading };
};
