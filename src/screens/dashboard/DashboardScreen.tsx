import { useDashboardConstants } from '@/shared/constants/dashboard-constants';
import { Card } from '@/shared/ui/card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/typography/heading';
import { Texting } from '@/shared/ui/typography/texting';
import { PerfomanceChart } from './perfomance-chart';
import { InfoIcon } from '@/shared/ui/icons';
import styles from './main.module.scss';

export const DashboardScreen = () => {
  const dashbardConstants = useDashboardConstants();
  return (
    <FlexBlock direction="column" gap={40} block>
      <FlexBlock direction="column" gap={20} block>
        <FlexBlock direction="column" gap={12}>
          <Heading level={3}>Dashboard</Heading>
          <Texting className={styles.pageDescription}>
            Welcome back! Here&apos;s your portfolio overview.
          </Texting>
        </FlexBlock>
        <FlexBlock gap={16} block className={styles.cardsContainer}>
          {dashbardConstants.map(item => (
            <Card key={item.id} className={styles.card}>
              <FlexBlock
                direction="column"
                justifyContent="space-between"
                className={styles.contentContainer}
                block
              >
                <FlexBlock direction="column" gap={8} block>
                  <FlexBlock alignItems="center" justifyContent="space-between" block>
                    <Texting level={3} className={styles.lightText}>
                      {item.label}
                    </Texting>
                    <InfoIcon />
                  </FlexBlock>
                  <Texting level={1} className={styles.cardValue}>
                    {item.value}
                    {/* {item?.valuePostifx ? (
                      <span className={styles.valuePostifx}>{item.valuePostifx}</span>
                    ) : null} */}
                  </Texting>
                </FlexBlock>
                {item.action ? item.action : null}
                {/* {item.lastMonthchange && (
                  <Texting level={3} className={styles.lightText}>
                    <span>{item.lastMonthchange}</span> vs last month
                  </Texting>
                )} */}
              </FlexBlock>
            </Card>
          ))}
        </FlexBlock>
      </FlexBlock>
      <PerfomanceChart />
      {/* <TransactionTable /> */}
    </FlexBlock>
  );
};
