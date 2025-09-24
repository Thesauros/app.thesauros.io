import { useAPRTicks, useUserEarnedTicks } from '@/shared/api/dashboard';
import { useMarketAPRTicks } from '@/shared/api/dashboard/useHighestMarketAprTicks';
import { useAccount } from '@/shared/blockchain/useAccount';
import { formatDate } from '@/shared/date';
import { useMemo } from 'react';

export const useAPRData = ({ coinName }: { coinName: 'USDC' | 'USDT' }) => {
  const { data: aprData, isLoading: isAPRLoading } = useAPRTicks({
    token: coinName,
    interval: 1,
    intervals: 7,
  });

  const { data: marketData, isLoading: isMarketAPRLoading } = useMarketAPRTicks({
    token: coinName,
    interval: 1,
    intervals: 7,
  });

  const aprDatas = useMemo(() => {
    return aprData
      ? [...aprData].map((item, index) => ({
          date: formatDate(item.from),
          dateValue: item.value === null ? 0 : item.value,
          marketValue: marketData && marketData[index]?.value ? marketData[index]?.value : 0,
        }))
      : undefined;
  }, [aprData, marketData]);

  return useMemo(
    () => ({
      data: aprDatas && aprDatas.length > 0 ? [...aprDatas].reverse() : [],
      isLoading: isAPRLoading && isMarketAPRLoading,
    }),
    [aprDatas, isAPRLoading, isMarketAPRLoading]
  );
};

export const useProfitData = ({ coinName }: { coinName: 'USDC' | 'USDT' }) => {
  const { address } = useAccount();
  const { data, isLoading } = useUserEarnedTicks({
    address: address,
    token: coinName,
    interval: 1,
    intervals: 7,
  });

  return useMemo(
    () => ({
      data: data
        ? [...data].reverse().map(item => ({
            date: formatDate(item.from),
            dateValue: item.value === null ? 0 : item.value,
          }))
        : undefined,
      isLoading: isLoading,
    }),
    [data, isLoading]
  );
};

export const profitData = [
  { time: '12 AM', profit: 120 },
  { time: '4 AM', profit: 80 },
  { time: '8 AM', profit: 200 },
  { time: '12 PM', profit: 150 },
  { time: '4 PM', profit: 180 },
  { time: '8 PM', profit: 100 },
  { time: '11 PM', profit: 90 },
];

export const sessionsData = [
  { time: '12 AM', sessions: 50 },
  { time: '4 AM', sessions: 30 },
  { time: '8 AM', sessions: 120 },
  { time: '12 PM', sessions: 200 },
  { time: '4 PM', sessions: 380 },
  { time: '8 PM', sessions: 150 },
  { time: '11 PM', sessions: 80 },
];
