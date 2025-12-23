import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useVaultsPosition } from './useVaultsPosition';

type RefetchCallback = () => void;

const REFETCH_DELAYS = [0, 2000, 5000] as const;

export const useRefetchAfterTransaction = () => {
  const queryClient = useQueryClient();
  const { refetchData: refetchVaultsPosition } = useVaultsPosition();

  const createRefetchWithCallbacks = useCallback(
    (...additionalRefetches: RefetchCallback[]) => {
      return () => {
        const refetchAll = () => {
          refetchVaultsPosition();
          additionalRefetches.forEach(refetch => refetch());
          queryClient.invalidateQueries({ queryKey: ['readContract'] });
        };

        REFETCH_DELAYS.forEach(delay => {
          if (delay === 0) {
            refetchAll();
          } else {
            setTimeout(refetchAll, delay);
          }
        });
      };
    },
    [queryClient, refetchVaultsPosition]
  );

  return { createRefetchWithCallbacks };
};
