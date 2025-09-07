import { customFetch, getApiUrl, useCustomQueryKey } from '../core';
import { TTaskRaw } from './types';

type TUserPointsInfoRaw = {
  success: boolean;
  data: {
    id: number;
    currentSeason: number;
    currentTasks: TTaskRaw[];
  };
  message: string;
};

const fetchSeasonId = async (): Promise<TUserPointsInfoRaw | undefined> => {
  return customFetch<TUserPointsInfoRaw>(getApiUrl('global/current-season-id'));
};

export const useCurrentSeasonId = () => {
  const { data: userPointsInfo, isLoading } = useCustomQueryKey(['GET_CURRENT_SEASON_ID'], () =>
    fetchSeasonId()
  );

  return { userPointsInfo: userPointsInfo?.data, isLoading };
};
