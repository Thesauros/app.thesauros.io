import { useMemo } from 'react';
import { Button } from '../ui/button';
import { DepositModal } from '@/feature/deposit/ui/DepositModal';
import { useModal } from '../ui/modal';
import { useVaultsPosition, useVaultsTVL, useAccount } from '../blockchain';
import { round } from '../number/round';
import { useHighestApr, useCurrentAPR, useUserEarnedOverallicks } from '../api/dashboard';

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
  const { apr30D } = useCurrentAPR();

  const totalEarned = useMemo(() => (data ? data[data?.length - 1].value : 0), [data]);
  const { data: vaultsTVL } = useVaultsTVL();
  const { data: totalPosition } = useVaultsPosition();
  const { data: performerOfTheWeek } = useHighestApr(7);

  return [
    {
      id: 'apy',
      label: 'APY',
      value: `${round(apr30D)}%`,
      action: (
        <Button size="xs" onClick={() => open(<DepositModal />)}>
          Earn
        </Button>
      ),
    },
    {
      id: 'my-position',
      label: 'My Position',
      value: `$${totalPosition ? round(totalPosition) : 0}`,
    },
    {
      id: 'best-performer',
      label: 'Best Performer of the Week',
      value: performerOfTheWeek,
    },
    {
      id: 'total-profit',
      label: 'Total Earned',
      value: `$${totalEarned}`,
    },
    {
      id: 'tvl',
      label: 'TVL',
      value: `$${vaultsTVL ?? '...'}`,
    },
  ];
};
