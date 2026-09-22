import { ReactNode } from 'react';
import { useRequireSignature } from '@/features/sign-terms';

type TProps = {
  children: ReactNode;
};

export const AppInitializer = ({ children }: TProps) => {
  useRequireSignature();

  return <>{children}</>;
};
