import { TAddress, TArg, TChainID } from '../../../shared/blockchain/core/types';
import { useContractWrite } from '../../../shared/blockchain/core/useContractWrite';

export const useDeposit = ({
  vaultAddress,
  chainID,
  args,
  onSuccess,
  onError,
  enabled = true,
}: {
  vaultAddress: TAddress;
  chainID: TChainID;
  args: TArg[];
  onSuccess?: (data: `0x${string}`) => void;
  onError?: (error: Error | null) => void;
  enabled?: boolean;
}) => {
  const { writeWithoutSimulation, isLoading } = useContractWrite({
    address: vaultAddress,
    functionName: 'deposit',
    chainID: chainID,
    args: args,
    onSuccess,
    onError,
    enabled,
  });

  // Use writeWithoutSimulation to avoid consuming paid RPC credits
  // Wallet will validate the transaction before signing
  const deposit = () => {
    writeWithoutSimulation();
  };

  return { deposit, isDepositLoading: isLoading };
};
