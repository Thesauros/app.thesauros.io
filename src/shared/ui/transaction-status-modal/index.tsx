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
  chainId,
}: {
  data?: TAddress;
  status: 'success' | 'failed';
  type: 'deposit' | 'withdraw';
  amount?: number;
  coinName?: string;
  chainId: number;
}) => {
  const { close } = useModal();
  const TYPE_MAP_TO_ICON = { deposit: <DownloadIcon />, withdraw: <CoinHand /> };
  const TYPE_STATUS_TO_TEXT = { success: 'Successful', failed: 'Unsuccessful' };

  const NETWORK_EXPLORER_URL: Record<number, string> = {
    42161: 'https://arbiscan.io/tx/',
    8453: 'https://basescan.org/tx/',
    1: 'https://etherscan.io/tx/',
    9745: 'https://plasmascan.to/tx/',
    143: 'https://monadvision.com/tx/',
  };

  const getExplorerUrl = (chainId: number, data: TAddress) => {
    return `${NETWORK_EXPLORER_URL[chainId]}/${data}`;
  };

  const handleOpenExplorer = () => {
    if (data) {
      const explorerUrl = getExplorerUrl(chainId, data);
      window.open(explorerUrl, '_blank');
    }
  };

  return (
    <div data-testid="successful-operation-modal">
      <FlexBlock direction="column" gap={24} block>
        {/* Header */}
        <FlexBlock justifyContent="end" alignItems="center" block>
          <CloseIcon onClick={close} data-testid="successful-operation-modal-close" />
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
                <span data-testid="successful-operation-copy-tx-button">
                  <CopyButton value={String(data)} />
                </span>
                <LinkIcon
                  onClick={handleOpenExplorer}
                  data-testid="successful-operation-view-tx-link"
                />
              </FlexBlock>
            </FlexBlock>
          )}
        </FlexBlock>
        <Button
          size="lg"
          onClick={() => close()}
          fullWidth
          data-testid="successful-operation-done-button"
        >
          Done
        </Button>
      </FlexBlock>
    </div>
  );
};
