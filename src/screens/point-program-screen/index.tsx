import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/typography/heading';
import { Texting } from '@/shared/ui/typography/texting';
import styles from './point-program.module.scss';
import { useUserPointProgramInfo } from './mocks';
import { Card } from '@/shared/ui/card';
import { InfoIcon } from '@/shared/ui/icons';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { SuccessIcon } from '@/shared/ui/icons/succes';
import { PendingIcon } from '@/shared/ui/icons/pending';
import { useCurrentSeason } from '@/shared/api/pointProgram/useCurrentSeasonId';
import { getProgressByDates } from './getProgressByDate';
import { useMemo } from 'react';
import { Badge } from '@/shared/ui/badge';
import { GenerateLinkModal } from './generate-link-modal';
import { Button } from '@/shared/ui/button';
import { useModal } from '@/shared/ui/modal';
import { useTaskStatuses } from '@/shared/api/pointProgram/useTaskStatuses';
import { useAccount } from '@/shared/blockchain/useAccount';

export const PointProgramScreen = () => {
  const { open } = useModal();
  const { address, isConnected } = useAccount();
  const pointProgramInfo = useUserPointProgramInfo();
  const { seasonInfo } = useCurrentSeason();
  const { userTaskStatuses } = useTaskStatuses(address);

  const progressBarValue = useMemo(() => {
    if (!seasonInfo?.season.startDate || !seasonInfo?.season.endDate) {
      return null;
    }

    return getProgressByDates(seasonInfo?.season.startDate, seasonInfo?.season.endDate);
  }, [seasonInfo?.season]);

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
        <FlexBlock gap={16} block className={styles.pointProgramContainer}>
          {pointProgramInfo.map(item => (
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
              Season {seasonInfo?.seasonNumber}
            </Texting>
            {isConnected && <Badge label="Main User" />}
          </FlexBlock>
          <Texting level={2} weight="regular" className={styles.seasonDescription}>
            {seasonInfo?.season.description}
          </Texting>
          <div className={styles.progressBarContainer}>
            {progressBarValue && (
              <ProgressBar
                value={progressBarValue.value}
                max={progressBarValue.max}
                withGradient={true}
                showPercentage={true}
                showRemainingDays={true}
                remainingDays={progressBarValue.remainingDays}
              />
            )}
          </div>
        </FlexBlock>
      </Card>
      {isConnected && (
        <FlexBlock direction="column" gap={22} block>
          <Texting level={1} weight="semibold">
            Earn Points
          </Texting>
          <FlexBlock direction="column" gap={12} block>
            {seasonInfo?.season.tasks?.map(element => (
              <Card className={styles.card} key={element.title}>
                <FlexBlock gap={12} block className={styles.classContainer}>
                  <FlexBlock gap={20} block>
                    <div>
                      {userTaskStatuses?.tasks[element.id] === 'done' ? (
                        <SuccessIcon />
                      ) : (
                        <PendingIcon />
                      )}
                    </div>
                    <FlexBlock direction="column" gap={12}>
                      <FlexBlock direction="column" gap={8}>
                        <Texting level={2} className={styles.title}>
                          {element.title}
                        </Texting>
                        <Texting
                          level={3}
                          weight="regular"
                          className={styles.pointBlockDescription}
                        >
                          {element.description}
                        </Texting>
                      </FlexBlock>
                    </FlexBlock>
                  </FlexBlock>
                  <FlexBlock gap={20} alignItems="center">
                    <Texting level={2} className={styles.value}>
                      {element.points}PTS
                    </Texting>
                    {element.id === 'invite_friends' && (
                      <Button size="sm" onClick={() => open(<GenerateLinkModal />)}>
                        Generate Link
                      </Button>
                    )}
                  </FlexBlock>
                </FlexBlock>
              </Card>
            ))}
          </FlexBlock>
        </FlexBlock>
      )}
    </FlexBlock>
  );
};
