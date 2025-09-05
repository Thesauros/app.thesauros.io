import { useAccount } from 'wagmi';

export const useNetwork = () => {
  const { chain } = useAccount();

  return { chain };
};
