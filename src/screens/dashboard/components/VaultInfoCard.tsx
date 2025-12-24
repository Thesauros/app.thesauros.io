import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/new-typography/heading';
import { Body } from '@/shared/ui/new-typography/body';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import { UsdcIcon } from '@/shared/ui/icons/usdc-icon';
import { LightningIcon } from '@/shared/ui/icons/lightning-icon';
import { StarsIcon } from '@/shared/ui/icons/stars-icon';
import { formatNumberWithCommas } from '@/shared/number/formatNumberWithCommas';
import styles from '../main.module.scss';

type VaultInfoCardProps = {
  isMobile: boolean;
  netApy: number;
  vaultsTVL: number | undefined;
};

const VAULT_DESCRIPTION =
  'Your stablecoins are automatically allocated across top and safest DeFi providers holding over $60 billion in assets. When yields shift, the system reallocates funds to maintain the best available return.';

const WITHDRAW_TOOLTIP =
  'There are no fixed terms or lockups. You can withdraw your funds whenever you choose.';

const TVL_TOOLTIP =
  'TVL (Total Value Locked) means the total amount of money currently deposited by all users in this strategy. It works like Assets Under Management (AUM) in traditional finance, showing how much capital is being managed right now.';

export const VaultInfoCard = ({ isMobile, netApy, vaultsTVL }: VaultInfoCardProps) => {
  return (
    <FlexBlock direction="column" gap={16} className={styles.vaultInfoCard}>
      <FlexBlock justifyContent="space-between" alignItems="center" block>
        <FlexBlock gap={isMobile ? 8 : 12} alignItems="center">
          <UsdcIcon size={isMobile ? 24 : 40} />
          {isMobile ? (
            <Body level={2} weight="bold">
              USDC
            </Body>
          ) : (
            <Heading level={5} weight="bold">
              USDC
            </Heading>
          )}
        </FlexBlock>
        {isMobile && (
          <FlexBlock alignItems="center" gap={8}>
            <Subtitle level={2} weight="regular" className={styles.secondaryHighlight}>
              APY
            </Subtitle>
            <Body level={2} weight="bold">
              {netApy}%
            </Body>
            <StarsIcon />
          </FlexBlock>
        )}
      </FlexBlock>

      {!isMobile ? (
        <Body level={2} weight="regular" className={styles.secondaryHighlight}>
          {VAULT_DESCRIPTION}
        </Body>
      ) : (
        <Caption weight="regular" className={styles.secondaryHighlight}>
          {VAULT_DESCRIPTION}
        </Caption>
      )}

      <FlexBlock alignItems="center" gap={isMobile ? 80 : 32}>
        <FlexBlock direction="column" gap={4}>
          <Tooltip withIcon tooltipText={WITHDRAW_TOOLTIP}>
            <Caption weight="regular" className={styles.secondaryHighlight}>
              Withdraw
            </Caption>
          </Tooltip>
          <FlexBlock alignItems="center" gap={4}>
            <LightningIcon />
            <Body level={2} weight="bold">
              INSTANT
            </Body>
          </FlexBlock>
        </FlexBlock>
        <FlexBlock direction="column" gap={4}>
          <Tooltip withIcon tooltipText={TVL_TOOLTIP}>
            <Caption weight="regular" className={styles.secondaryHighlight}>
              TVL
            </Caption>
          </Tooltip>
          <Body level={2} weight="bold">
            ${formatNumberWithCommas(vaultsTVL ?? 0)}
          </Body>
        </FlexBlock>
      </FlexBlock>
    </FlexBlock>
  );
};
