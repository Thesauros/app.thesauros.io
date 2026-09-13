import { FlexBlock } from '@/shared/ui/flex-block';
import { Button } from '@/shared/ui/button';
import { Caption } from '@/shared/ui/new-typography/caption';
import { ConvertBadge } from '@/shared/ui/convert-badge';
import styles from '../main.module.scss';

type DepositActionsProps = {
  isMobile: boolean;
  isDeposited: boolean;
  onDepositClick: () => void;
  onWithdrawClick: () => void;
};

export const DepositActions = ({
  isMobile,
  isDeposited,
  onDepositClick,
  onWithdrawClick,
}: DepositActionsProps) => {
  if (!isDeposited) {
    return (
      <FlexBlock
        justifyContent="space-between"
        alignItems="center"
        direction={isMobile ? 'column' : 'row'}
      >
        <FlexBlock
          alignItems="center"
          direction={isMobile ? 'column' : 'row'}
          gap={isMobile ? 16 : 20}
          block={isMobile}
        >
          {isMobile && <ConvertBadge />}
          <Button size="xl" onClick={onDepositClick} fullWidth={isMobile}>
            Deposit
          </Button>
        </FlexBlock>
        {!isMobile && <ConvertBadge />}
      </FlexBlock>
    );
  }

  return (
    <FlexBlock
      justifyContent="space-between"
      alignItems="center"
      direction={isMobile ? 'column' : 'row'}
      gap={isMobile ? 16 : 0}
    >
      <ConvertBadge />
      <FlexBlock
        alignItems="center"
        direction={isMobile ? 'column-reverse' : 'row'}
        gap={12}
        block={isMobile}
      >
        <Button variant="outline" size="lg" onClick={onWithdrawClick} fullWidth={isMobile}>
          Withdraw
        </Button>
        <Button size="lg" fullWidth={isMobile} onClick={onDepositClick}>
          Add to deposit
        </Button>
      </FlexBlock>
      {isMobile && (
        <Caption weight="regular" className={styles.secondaryHighlight}>
          Withdraw anytime — no lock period
        </Caption>
      )}
    </FlexBlock>
  );
};
