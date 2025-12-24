import { ReactNode } from 'react';
import { useAutoSwitchToNetwork } from '@/shared/blockchain/useAutoSwitchToNetwork';
import { useRequireSignature } from '@/features/sign-terms';

type TProps = {
  children: ReactNode;
};

export const AppInitializer = ({ children }: TProps) => {
  useAutoSwitchToNetwork({ targetChainID: 8453 });
  useRequireSignature();

  return <>{children}</>;
};
