import { useMemo } from 'react';
import { Button } from '../ui/button';
import { useVaultsPosition, useVaultsTVL, useAccount, vaults } from '../blockchain';
import { round } from '../number/round';
import { useHighestApr, useUserEarnedOverallicks } from '../api/dashboard';
import { useOnchainCurrentAPY } from '../blockchain/useOnchainCurrentAPY';

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
  const { data } = useUserEarnedOverallicks({ interval: 1, intervals: 7, address: address });

  const totalEarned = useMemo(() => (data ? round(data[0].value, 6) : 0), [data]);
  const { data: vaultsTVL } = useVaultsTVL();
  const { data: totalPosition } = useVaultsPosition();
  const { data: performerOfTheWeek } = useHighestApr(7);
  const apy = useOnchainCurrentAPY({
    vaultAddress: vaults[0].vaultAddress,
    chainID: vaults[0].chainID,
  });
  return [
    {
      id: 'apy',
      label: 'CurrentAPY',
      value: `${round(apy)}%`,
      // action: (
      //   <Button size="xs" onClick={() => open(<DepositModal />)}>
      //     Earn
      //   </Button>
      // ),
    },
    {
      id: 'my-position',
      label: 'My Position',
      value: `$${totalPosition ? round(totalPosition) : 0}`,
    },
    {
      id: 'best-performer',
      label: 'Best Performer',
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
