import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/typography/heading';
import { Texting } from '@/shared/ui/typography/texting';
import styles from './main.module.scss';
import { PerfomanceChart } from './perfomance-chart';
import { TransactionTable } from './transaction-table';

const items = [
  { id: 'apy', label: 'APY', value: '12.25%', action: <Button size="xs">Earn</Button> },
  {
    id: 'total-profit',
    label: 'Total Profit (USD)',
    value: '$4,000,000/mo',
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

export default function DashboardPage() {
  return (
    <FlexBlock direction="column" gap={40} block>
      <FlexBlock direction="column" gap={20} block>
        <FlexBlock direction="column" gap={12}>
          <Heading level={3}>Dashboard</Heading>
          <Texting>Welcome back! Here`s your portfolio overview.</Texting>
        </FlexBlock>
        <FlexBlock gap={16} block>
          {items.map(item => (
            <Card key={item.id} className={styles.card}>
              <FlexBlock direction="column" justifyContent="space-between" block>
                <FlexBlock direction="column" gap={8}>
                  <Texting level={3}>{item.label}</Texting>
                  <Texting level={2}>{item.value}</Texting>
                </FlexBlock>
                {item.action ? item.action : null}
                {item.lastMonthchange && (
                  <Texting level={3}>{item.lastMonthchange} vs last month</Texting>
                )}
              </FlexBlock>
            </Card>
          ))}
        </FlexBlock>
      </FlexBlock>
      <PerfomanceChart />
      <TransactionTable />
    </FlexBlock>
  );
}
