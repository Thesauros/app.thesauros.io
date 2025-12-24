import Image from 'next/image';
import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { HexensIcon } from '@/shared/ui/icons/hexens-icon';
import ProtocolsIcons from '@/shared/ui/images/protocols.png';
import styles from '../main.module.scss';

type AboutSectionProps = {
  isMobile: boolean;
};

const ABOUT_TEXT = `The system constantly monitors yield across DeFi protocols and rebalances positions when conditions change — keeping your returns optimized in real time. Under the hood, the underlying protocols generate yield through over-collateralized lending. Borrowers must lock more collateral than they borrow, and if they fail to repay, their collateral is liquidated to cover lenders' funds. This model keeps each market solvent while enabling returns on deposited assets. By aggregating these markets, the strategy diversifies exposure and smooths out fluctuations between platforms. It automatically shifts capital toward higher-yield, balanced-risk opportunities — without any manual action required from the user.`;

export const AboutSection = ({ isMobile }: AboutSectionProps) => {
  return (
    <Card block>
      <FlexBlock direction="column" gap={16}>
        {!isMobile ? (
          <Subtitle level={1} weight="regular">
            About
          </Subtitle>
        ) : (
          <Caption weight="regular">About</Caption>
        )}
        <FlexBlock gap={16} direction="column" alignItems="flex-start">
          <FlexBlock gap={16} direction={isMobile ? 'column' : 'row'} block>
            <Card variant="secondary" className={styles.partnersBlock} block>
              <FlexBlock justifyContent="space-between" gap={16}>
                <FlexBlock direction="column" gap={4}>
                  <Subtitle level={2}>Protocols</Subtitle>
                  <Caption className={styles.grayText} weight="regular">
                    Funds are diversified across leading DeFi protocols (may vary)
                  </Caption>
                </FlexBlock>
                <Image src={ProtocolsIcons} alt="Protocols icons" width={116} />
              </FlexBlock>
            </Card>
            <Card variant="secondary" className={styles.partnersBlock} block>
              <FlexBlock justifyContent="space-between" gap={16}>
                <FlexBlock direction="column" gap={4}>
                  <Subtitle level={2}>Audited by Hexens</Subtitle>
                  <Caption className={styles.grayText} weight="regular">
                    Smart contracts reviewed and verified for safety and reliability
                  </Caption>
                </FlexBlock>
                <HexensIcon />
              </FlexBlock>
            </Card>
          </FlexBlock>
          <Caption weight="regular" className={styles.aboutText}>
            {ABOUT_TEXT}
          </Caption>
        </FlexBlock>
      </FlexBlock>
    </Card>
  );
};
