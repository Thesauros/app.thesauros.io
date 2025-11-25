import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/new-typography/heading';
import styles from './point-program.module.scss';
import { useUserPointProgramInfo } from './mocks';
import { Card } from '@/shared/ui/new-card';
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
import { Body } from '@/shared/ui/new-typography/body';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import { NewInfoIcon } from '@/shared/ui/icons/new-info';

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
    <FlexBlock direction="column" gap={16} block>
      <FlexBlock direction="column" gap={16} block>
        <FlexBlock direction="column" gap={4}>
          <Heading level={4} weight="bold">
            Points Program
          </Heading>
          <Body level={2} weight="regular" className={styles.secondaryText}>
            Earn points for early participation and get ready for the biggest airdrop in DeFi
            history
          </Body>
        </FlexBlock>
        <FlexBlock gap={16} block className={styles.pointProgramContainer}>
          {pointProgramInfo.map(item => (
            <Card key={item.title} className={styles.card}>
              <FlexBlock direction="column" justifyContent="space-between" block>
                <FlexBlock direction="column" gap={16} block>
                  <FlexBlock alignItems="center" justifyContent="space-between" block>
                    <Subtitle level={2} weight="regular" className={styles.secondaryText}>
                      {item.title}
                    </Subtitle>
                    <Tooltip tooltipText={''}>
                      <NewInfoIcon />
                    </Tooltip>
                  </FlexBlock>
                  <Heading level={5}>{item.value}</Heading>
                </FlexBlock>
              </FlexBlock>
            </Card>
          ))}
        </FlexBlock>
      </FlexBlock>
      <Card className={styles.card}>
        <FlexBlock direction="column" block gap={20}>
          <FlexBlock alignItems="center" justifyContent="space-between" block>
            <Heading level={5} weight="bold">
              Season {seasonInfo?.seasonNumber}
            </Heading>
            {isConnected && <Badge label="Main User" />}
          </FlexBlock>
          <FlexBlock direction="column" gap={16} block>
            <Body level={2} weight="regular" className={styles.secondaryText}>
              {seasonInfo?.season.description}
            </Body>
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
        </FlexBlock>
      </Card>
      {isConnected && (
        <FlexBlock direction="column" gap={8} block>
          <Heading level={5} weight="bold">
            Earn Points
          </Heading>
          <FlexBlock direction="column" gap={12} block>
            {seasonInfo?.season.tasks?.map(element => (
              <Card className={styles.card} key={element.title}>
                <FlexBlock gap={12} block className={styles.classContainer}>
                  <FlexBlock
                    gap={12}
                    block
                    alignItems="flex-start"
                    className={styles.taskContainer}
                  >
                    {userTaskStatuses?.tasks[element.id] === 'done' ? (
                      <SuccessIcon />
                    ) : (
                      <PendingIcon />
                    )}

                    <FlexBlock direction="column" gap={12}>
                      <FlexBlock direction="column" gap={4}>
                        <Subtitle level={1} weight="bold" className={styles.title}>
                          {element.title}
                        </Subtitle>
                        <Body level={2} weight="regular" className={styles.secondaryText}>
                          {element.description}
                        </Body>
                      </FlexBlock>
                    </FlexBlock>
                  </FlexBlock>
                  <FlexBlock gap={20} alignItems="center">
                    <Subtitle level={1} weight="bold" className={styles.value}>
                      +{element.points}PTS
                    </Subtitle>
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
      <Card>
        <FlexBlock direction="column" block gap={16}>
          <Subtitle level={1} weight="regular">
            About Thesauros Points
          </Subtitle>
          <Body level={2} weight="regular" className={styles.secondaryText}>
            Points reflect your activity inside Thesauros. You earn them by holding funds,
            completing actions, and inviting friends.The more you hold, the more you earn.
          </Body>
        </FlexBlock>
      </Card>
    </FlexBlock>
  );
};
