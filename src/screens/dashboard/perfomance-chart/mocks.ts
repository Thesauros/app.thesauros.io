import { useAPRTicks, useUserEarnedTicks } from '@/shared/api/dashboard';
import { useMarketAPRTicks } from '@/shared/api/dashboard/useHighestMarketAprTicks';
import { useAccount } from '@/shared/blockchain/useAccount';
import { formatDate } from '@/shared/date';
import { round } from '@/shared/number/round';
import { useMemo } from 'react';

export const useAPRData = ({ coinName, period }: { coinName: 'USDC' | 'USDT'; period: number }) => {
  const { data: aprData, isLoading: isAPRLoading } = useAPRTicks({
    token: coinName,
    interval: 1,
    intervals: period,
  });

  const { data: marketData, isLoading: isMarketAPRLoading } = useMarketAPRTicks({
    token: coinName,
    interval: 1,
    intervals: period,
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

  return useMemo(() => {
    const reversedData = aprDatas && aprDatas.length > 0 ? [...aprDatas].reverse() : [];
    const average =
      reversedData.length > 0
        ? reversedData.reduce((sum, item) => sum + item.dateValue, 0) / reversedData.length
        : 0;

    return {
      data: reversedData,
      isLoading: isAPRLoading && isMarketAPRLoading,
      average: round(average, 2),
    };
  }, [aprDatas, isAPRLoading, isMarketAPRLoading]);
};

export const useProfitData = ({
  coinName,
  period,
}: {
  coinName: 'USDC' | 'USDT';
  period: number;
}) => {
  const { address } = useAccount();
  const { data, isLoading } = useUserEarnedTicks({
    address: address,
    token: coinName,
    interval: 1,
    intervals: period,
  });

  const reversedData = useMemo(
    () =>
      data && data.length > 0
        ? [...data].reverse().map(item => ({
            date: formatDate(item.from),
            dateValue: item.value === null ? 0 : round(item.value, 6),
          }))
        : [],
    [data]
  );

  const total =
    reversedData.length > 0 ? reversedData.reduce((sum, item) => sum + item.dateValue, 0) : 0;

  return useMemo(
    () => ({
      data: reversedData,
      total: total,
      isLoading: isLoading,
    }),
    [isLoading, reversedData, total]
  );
};
