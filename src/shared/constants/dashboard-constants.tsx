import { Button } from '../ui/button';

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
