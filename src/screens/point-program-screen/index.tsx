import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/typography/heading';
import { Texting } from '@/shared/ui/typography/texting';
import styles from './point-program.module.scss';
import { earnedPoints, pointProgramMocks } from './mocks';
import { Card } from '@/shared/ui/card';
import { InfoIcon } from '@/shared/ui/icons';
import { EarlyAdopterBadge } from '@/shared/ui/icons/early-adopter-badge';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { SuccessIcon } from '@/shared/ui/icons/succes';
import { PendingIcon } from '@/shared/ui/icons/pending';

export const PointProgramScreen = () => {
  return (
    <FlexBlock direction="column" gap={40} block>
      <FlexBlock direction="column" gap={20} block>
        <FlexBlock direction="column" gap={20} block>
          <FlexBlock direction="column" gap={12}>
            <Heading level={3} className={styles.lightText}>
              Points Program
            </Heading>
            <Texting className={styles.pageDescription}>
              Earn points for early participation and get ready for the biggest airdrop in DeFi
              history
            </Texting>
          </FlexBlock>
        </FlexBlock>
        <FlexBlock gap={16} block>
          {pointProgramMocks.map(item => (
            <Card key={item.title} className={styles.card}>
              <FlexBlock direction="column" justifyContent="space-between" block>
                <FlexBlock direction="column" gap={12} block>
                  <FlexBlock alignItems="center" justifyContent="space-between" block>
                    <Texting level={3} className={styles.title}>
                      {item.title}
                    </Texting>
                    <InfoIcon />
                  </FlexBlock>
                  <Heading level={3} weight="semibold" className={styles.value}>
                    {item.value}
                  </Heading>
                </FlexBlock>
                {item.additionalInfo && (
                  <Texting level={3} weight="regular" className={styles.additionalInfo}>
                    {item.additionalInfo}
                  </Texting>
                )}
              </FlexBlock>
            </Card>
          ))}
        </FlexBlock>
      </FlexBlock>
      <Card className={styles.card}>
        <FlexBlock direction="column" block gap={0}>
          <FlexBlock alignItems="center" justifyContent="space-between" block>
            <Texting level={1} weight="semibold">
              Season 1
            </Texting>
            <EarlyAdopterBadge />
          </FlexBlock>
          <Texting level={2} weight="regular" className={styles.seasonDescription}>
            Bootstrap the protocol with early liquidity. First 1000 users get exclusive <br /> Early
            Adopter status and 2x point multiplier for the entire season.
          </Texting>
          <div className={styles.progressBarContainer}>
            <ProgressBar
              value={65}
              max={100}
              withGradient={true}
              showPercentage={true}
              showRemainingDays={true}
              remainingDays={28}
            />
          </div>
        </FlexBlock>
      </Card>
      <FlexBlock direction="column" gap={22} block>
        <Texting level={1} weight="semibold">
          Earn Points
        </Texting>
        <FlexBlock direction="column" gap={12} block>
          {earnedPoints.map(element => (
            <Card className={styles.card} key={element.title}>
              <FlexBlock gap={12} block>
                <FlexBlock gap={20} block>
                  {element.isCompleted ? <SuccessIcon /> : <PendingIcon />}
                  <FlexBlock direction="column" gap={12}>
                    <FlexBlock direction="column" gap={8}>
                      <Texting level={2} className={styles.title}>
                        {element.title}
                      </Texting>
                      <Texting level={3} weight="regular" className={styles.pointBlockDescription}>
                        {element.description}
                      </Texting>
                    </FlexBlock>
                    {element.progressBar ? (
                      <ProgressBar
                        value={element.progressBar.current}
                        max={element.progressBar.total}
                        postfix={element.progressBar.postfix}
                        valuePrefix={element.progressBar.prefix}
                        withValues
                      />
                    ) : null}
                  </FlexBlock>
                </FlexBlock>
                <FlexBlock gap={20} alignItems="center">
                  <Texting level={2} className={styles.value}>
                    {element.value}
                  </Texting>
                  {element.action ? element.action : null}
                </FlexBlock>
              </FlexBlock>
            </Card>
          ))}
        </FlexBlock>
      </FlexBlock>
    </FlexBlock>
  );
};
