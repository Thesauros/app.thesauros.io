import { customFetch, getApiUrl, useCustomQueryKey } from '../core';

type TLargeDepositCountResponse = {
  success: boolean;
  data: {
    count: number;
  };
  message: string;
};

const fetchLargeDepositCount = async (): Promise<TLargeDepositCountResponse> => {
  const response = await customFetch<TLargeDepositCountResponse>(
    getApiUrl('users/stats/large-deposit-count')
  );
  return response;
};

export const useLargeDepositCount = ({ enabled }: { enabled: boolean }) => {
  const {
    data,
    isLoading: isLoadingLargeDepositCount,
    refetch: refetchLargeDepositCount,
  } = useCustomQueryKey(['GET_LARGE_DEPOSIT_COUNT'], fetchLargeDepositCount, { enabled });

  return {
    largeDepositCount: data?.data?.count,
    isLoadingLargeDepositCount,
    refetchLargeDepositCount,
  };
};
