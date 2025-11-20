import { TAddress } from '@/shared/blockchain';
import { FlexBlock } from '@/shared/ui/flex-block';
import { CloseIcon } from '@/shared/ui/icons/close';
import { CoinHand } from '../icons/coin-hand';
import { DownloadIcon } from '../icons/download-icon';
import { Subtitle } from '../new-typography/subtitle';
import { capitalize, shortString } from '@/shared/string';
import { Body } from '../new-typography/body';
import { CopyButton } from '../copy-button';
import { LinkIcon } from '../icons/link-icon';
import { useModal } from '../modal';
import styles from './transaction-status-modal.module.scss';
import { Heading } from '../new-typography/heading';
import { formatDateTime } from '@/shared/date';
import { Button } from '../button';

export const TransactionStatusModal = ({
  data,
  status,
  type,
  amount,
  coinName,
}: {
  data?: TAddress;
  status: 'success' | 'failed';
  type: 'deposit' | 'withdraw';
  amount?: number;
  coinName?: string;
}) => {
  const { close } = useModal();
  const TYPE_MAP_TO_ICON = { deposit: <DownloadIcon />, withdraw: <CoinHand /> };
  const TYPE_STATUS_TO_TEXT = { success: 'Successful', failed: 'Unsuccessful' };

  const handleOpenExplorer = () => {
    if (data) {
      window.open(`https://arbiscan.io/tx/${data}`, '_blank');
    }
  };

  return (
    <FlexBlock direction="column" gap={24} block>
      {/* Header */}
      <FlexBlock justifyContent="end" alignItems="center" block>
        <CloseIcon onClick={close} />
      </FlexBlock>

      <FlexBlock direction="column" gap={12} justifyContent="center" alignItems="center" block>
        {TYPE_MAP_TO_ICON[type]}
        <Subtitle className={status === 'success' ? styles.success : styles.error}>
          {capitalize(type)} {TYPE_STATUS_TO_TEXT[status]}
        </Subtitle>
        {amount && coinName && (
          <Heading level={6} weight="bold">
            {type === 'deposit' ? '+' : ''}
            {amount} {coinName}
          </Heading>
        )}
      </FlexBlock>

      <FlexBlock direction="column" gap={16} block>
        <FlexBlock alignItems="center" justifyContent="space-between" block>
          <Body level={2} weight="regular" className={styles.secondary}>
            Date & time
          </Body>
          <Body level={2} weight="regular">
            {formatDateTime(new Date().toISOString())}
          </Body>
        </FlexBlock>
        {data && (
          <FlexBlock alignItems="center" justifyContent="space-between" block>
            <Body level={2} weight="regular" className={styles.secondary}>
              Txid
            </Body>
            <FlexBlock alignItems="center" gap={8}>
              <Body level={2} weight="regular">
                {shortString(data)}
              </Body>
              <CopyButton value={String(data)} />
              <LinkIcon onClick={handleOpenExplorer} />
            </FlexBlock>
          </FlexBlock>
        )}
      </FlexBlock>
      <Button size="lg" onClick={() => close()} fullWidth>
        Done
      </Button>
    </FlexBlock>
  );
};
