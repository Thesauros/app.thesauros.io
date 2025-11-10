import { FlexBlock } from '@/shared/ui/flex-block';
import { Texting } from '@/shared/ui/typography/texting';
import { Button } from '@/shared/ui/button';
import { ArrowDown } from '@/shared/ui/icons/arrow-down';
import styles from './transaction-detail-modal.module.scss';
import { CopyButton } from '@/shared/ui/copy-button';
import { LinkButton } from '@/shared/ui/link-button';
import { useModal } from '@/shared/ui/modal';
import { CloseIcon } from '@/shared/ui/icons/close';
import type { ITransaction } from './mocks';

export const TransactionDetailModal = ({ transaction }: { transaction: ITransaction }) => {
  const { close } = useModal();

  return (
    <FlexBlock direction="column" gap={24}>
      <FlexBlock block alignItems="center" justifyContent="end">
        <CloseIcon onClick={close} />
      </FlexBlock>
      {/* MainInfo */}
      <FlexBlock direction="column" gap={12} alignItems="center" justifyContent="center">
        <ArrowDown />
        <Texting level={3} className={styles.depositTitle}>
          {transaction.type}
        </Texting>
        <Texting level={2} className={styles.depositValue}>
          {transaction.amount > 0 ? '+' : ''}
          {transaction.amount} {transaction.coin}
        </Texting>
      </FlexBlock>
      {/* Details */}
      <FlexBlock direction="column" gap={16} block>
        <FlexBlock direction="row" justifyContent="space-between" block>
          <Texting level={3} weight="regular" className={styles.description}>
            Type:
          </Texting>
          <Texting level={3} className={styles.descriptionValue}>
            {transaction.type}
          </Texting>
        </FlexBlock>

        <FlexBlock direction="row" justifyContent="space-between" block>
          <Texting level={3} weight="regular" className={styles.description}>
            Coin:
          </Texting>
          <Texting level={3} className={styles.descriptionValue}>
            {transaction.coin}
          </Texting>
        </FlexBlock>

        <FlexBlock direction="row" justifyContent="space-between" block>
          <Texting level={3} weight="regular" className={styles.description}>
            Amount:
          </Texting>
          <Texting level={3} className={transaction.amount > 0 ? styles.positive : styles.negative}>
            {transaction.amount > 0 ? '+' : ''} {transaction.amount}
          </Texting>
        </FlexBlock>

        <FlexBlock direction="row" justifyContent="space-between" block>
          <Texting level={3} weight="regular" className={styles.description}>
            Status:
          </Texting>
          <FlexBlock direction="row" gap={4} alignItems="center">
            <div className={styles.greenIndicator} />
            <Texting level={3} className={styles.descriptionValue}>
              Successfully
            </Texting>
          </FlexBlock>
        </FlexBlock>

        <FlexBlock direction="row" justifyContent="space-between" block>
          <Texting level={3} weight="regular" className={styles.description}>
            Data & Time:
          </Texting>
          <Texting level={3} className={styles.descriptionValue}>
            {transaction.dateTime}
          </Texting>
        </FlexBlock>

        <FlexBlock direction="row" justifyContent="space-between" block>
          <Texting level={3} weight="regular" className={styles.description}>
            Address:
          </Texting>
          <FlexBlock direction="row" gap={8} alignItems="center">
            <Texting level={3} className={styles.descriptionValue}>
              UQAGL3cchkJg_M...
            </Texting>
            <CopyButton value={'UQAGL3cchkJg_M'} />
            <LinkButton href="UQAGL3cchkJg_M" />
          </FlexBlock>
        </FlexBlock>

        <FlexBlock direction="row" justifyContent="space-between" block>
          <Texting level={3} weight="regular" className={styles.description}>
            Txid:
          </Texting>
          <FlexBlock direction="row" gap={8} alignItems="center">
            <Texting level={3} className={styles.descriptionValue}>
              c1ab43d5k8df8229...
            </Texting>
            <CopyButton value={'UQAGL3cchkJg_M'} />
            <LinkButton href="UQAGL3cchkJg_M" />
          </FlexBlock>
        </FlexBlock>
      </FlexBlock>

      <Button size="m" variant="primary" className={styles.doneButton} onClick={close}>
        Done
      </Button>
    </FlexBlock>
  );
};
