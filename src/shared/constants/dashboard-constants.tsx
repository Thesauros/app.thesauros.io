import { useMemo } from 'react';
import { useUserEarnedOverallicks } from '../api/dashboard/useUserEarnedOverall';
import { useAccount } from '../blockchain/useAccount';
import { Button } from '../ui/button';
import { DepositModal } from '@/feature/deposit/ui/DepositModal';
import { useModal } from '../ui/modal';
import { useVaultsTVL } from '../blockchain';

export const dashbardConstants = [
  { id: 'apy', label: 'APY', value: '12.25%', action: <Button size="xs">Earn</Button> },
  {
    id: 'total-profit',
    label: 'Total Profit (USD)',
    value: '$4,000,000',
    valuePostifx: '/mo',
    lastMonthchange: '+12.5%',
  },
  {
    id: 'estimated-apy',
    label: 'Estimated APY',
    value: '12.00%',
    lastMonthchange: '+0.8%',
  },
  {
    id: 'tvl',
    label: 'Total Value Locked',
    value: '$1,500,000,000',
    lastMonthchange: '+5.2%',
  },
];

export const useDashboardConstants = () => {
  const { address } = useAccount();
  const { open } = useModal();
  const { data } = useUserEarnedOverallicks({ interval: 1, intervals: 7, address: address });

  const totalEarned = useMemo(() => (data ? data[data?.length - 1].value : 0), [data]);
  const { data: vaultsTVL } = useVaultsTVL();

  return [
    {
      id: 'apy',
      label: 'APY',
      value: `${1}%`,
      action: (
        <Button size="xs" onClick={() => open(<DepositModal />)}>
          Earn
        </Button>
      ),
    },
    {
      id: 'total-profit',
      label: 'Total Earned (USD)',
      value: `$${totalEarned}`,
    },
    {
      id: 'tvl',
      label: 'Total Value Locked',
      value: `$${vaultsTVL ?? '...'}`,
      lastMonthchange: '+5.2%',
    },
  ];
};
