import { customFetch, getApiUrl, useCustomQueryKey } from '../core';
import { TTaskRaw } from './types';

type TUserPointsInfoRaw = {
  success: boolean;
  data: {
    seasonNumber: number;
    season: {
      name: string;
      description: string;
      startDate: number;
      endDate: number;
      multiplier: number;
      tasks: TTaskRaw[];
    };
  };
  message: string;
};

const fetchSeason = async (): Promise<TUserPointsInfoRaw | undefined> => {
  return customFetch<TUserPointsInfoRaw>(getApiUrl('global/current-season'));
};

export const useCurrentSeason = () => {
  const { data, isLoading } = useCustomQueryKey(['GET_CURRENT_SEASON'], () => fetchSeason());

  return { seasonInfo: data?.data, isLoading };
};
