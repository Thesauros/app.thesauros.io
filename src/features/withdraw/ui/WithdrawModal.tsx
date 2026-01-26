import { FlexBlock } from '@/shared/ui/flex-block';
import { CloseIcon } from '@/shared/ui/icons/close';
import { useModal } from '@/shared/ui/modal';
import { useCallback, useMemo, useState } from 'react';
import styles from './WithdrawModal.module.scss';
import { InputComponent } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { useSwitchNetwork } from '@/shared/blockchain/core/useSwitchNetwork';
import { round } from '@/shared/number/round';
import { useContractRead } from '@/shared/blockchain/core/useContractRead';
import { useWithdraw } from '../model/useWithdraw';
import { Heading } from '@/shared/ui/new-typography/heading';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Body } from '@/shared/ui/new-typography/body';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { UsdcIcon } from '@/shared/ui/icons/usdc-icon';
import { PointCoinIcon } from '@/shared/ui/icons/point-icon';
import { TransactionStatusModal } from '@/shared/ui/transaction-status-modal';
import { useOnchainCurrentAPY } from '@/shared/blockchain/useOnchainCurrentAPY';
import { useSelectedVault, useRefetchAfterTransaction, useAccount } from '@/shared/blockchain';

export const WithdrawModal = () => {
  const { close, open } = useModal();
  const [value, setValue] = useState('');
  const { address } = useAccount();

  const selectedVault = useSelectedVault();
  const { createRefetchWithCallbacks } = useRefetchAfterTransaction();

  const withdrawValue = Number(value) * 10 ** selectedVault.decimals;

  const apy = useOnchainCurrentAPY({
    vaultAddress: selectedVault.vaultAddress,
    chainID: selectedVault.chainID,
  });

  const selectBalance = useCallback(
    (data: unknown): number => round(Number(data) / 10 ** selectedVault.decimals, 2),
    [selectedVault.decimals]
  );

  const selectFeePercent = useCallback(
    (data: unknown): number => round(Number(data) / 10 ** selectedVault.decimals, 2),
    [selectedVault.decimals]
  );

  const { data: coinBalance, refetch: refetchCoinBalance } = useContractRead({
    address: selectedVault.vaultAddress,
    functionName: 'getBalanceOfAsset',
    args: [address],
    chainID: selectedVault.chainID,
    staleTime: 30000,
    selectData: selectBalance,
  });

  const refetchAfterWithdraw = createRefetchWithCallbacks(refetchCoinBalance);

  const { withdraw, isWithdrawingLoading } = useWithdraw({
    vaultAddress: selectedVault.vaultAddress,
    chainID: selectedVault.chainID,
    args: [withdrawValue, address, address],
    onSuccess: data => {
      open(
        <TransactionStatusModal
          data={data}
          amount={Number(value)}
          coinName={selectedVault.coinName}
          status="success"
          type="withdraw"
          chainId={selectedVault.chainID}
        />
      );
      refetchAfterWithdraw();
    },
    onError: error => {
      if (error)
        open(
          <TransactionStatusModal status="failed" type="withdraw" chainId={selectedVault.chainID} />
        );
    },
  });

  const { isNeedSwitch, switchNetwork } = useSwitchNetwork({
    targetChainID: selectedVault.chainID,
  });

  const { data: feePercent } = useContractRead({
    address: selectedVault.vaultAddress,
    functionName: 'withdrawFeePercent',
    chainID: selectedVault.chainID,
    selectData: selectFeePercent,
  });

  const userCoinBalance: number = useMemo(() => {
    if (typeof coinBalance === 'number') {
      return coinBalance;
    }
    return 0;
  }, [coinBalance]);

  const isMoreThanBalance = Number(value) > userCoinBalance;

  const handleButtonClick = useCallback(() => {
    if (isNeedSwitch) {
      switchNetwork(selectedVault.chainID);
    } else {
      withdraw();
    }
  }, [isNeedSwitch, switchNetwork, selectedVault.chainID, withdraw]);

  const setMaxValue = useCallback(() => {
    setValue(String(userCoinBalance));
  }, [userCoinBalance]);

  return (
    <FlexBlock direction="column" gap={24} block>
      {/* Header */}
      <FlexBlock justifyContent="space-between" alignItems="center" block>
        <Heading level={6} weight="regular">
          Withdraw Funds
        </Heading>
        <CloseIcon onClick={close} />
      </FlexBlock>

      {/* Withdraw block */}
      <FlexBlock direction="column" gap={4} block>
        <Caption>Amount to Withdraw</Caption>
        <InputComponent
          id="id"
          value={value}
          type="number"
          size="md"
          numberPrefix="$"
          textAlign="left"
          postfix={
            <Body level={2} weight="regular" className={styles.secondary}>
              {selectedVault.coinName}
            </Body>
          }
          fullWidth
          onChange={setValue}
          disabled={isWithdrawingLoading}
        />
      </FlexBlock>

      {/* Funds */}
      <FlexBlock direction="column" gap={8} block>
        <FlexBlock alignItems="center" justifyContent="space-between" block>
          <Caption weight="regular" className={styles.secondary}>
            Available:
          </Caption>
          <div style={{ cursor: 'pointer' }} onClick={setMaxValue}>
            <Body level={2} weight="regular">
              {round(userCoinBalance)} {selectedVault.coinName}
            </Body>
          </div>
        </FlexBlock>
        <FlexBlock alignItems="center" justifyContent="space-between" block>
          <Caption weight="regular" className={styles.secondary}>
            Withdrawal Fee:
          </Caption>
          <Body level={2} weight="regular">
            {round(Number(feePercent))}%
          </Body>
        </FlexBlock>
      </FlexBlock>

      <div className={styles.potentialProfitLoseBlock}>
        <FlexBlock direction="column" justifyContent="space-between" alignItems="center" block>
          <Caption weight="bold">Withdrawing will reduce your potential earnings per year:</Caption>
          <FlexBlock justifyContent="center" alignItems="center">
            <FlexBlock
              direction="column"
              justifyContent="center"
              alignItems="center"
              gap={4}
              className={styles.innerPotentialProfitBlock}
            >
              <Subtitle level={2} weight="medium">
                {round((Number(value) / 100) * apy)}
              </Subtitle>
              <FlexBlock gap={8} alignItems="center">
                <UsdcIcon size={16} />
                <Caption weight="regular">{selectedVault.coinName}</Caption>
              </FlexBlock>
            </FlexBlock>

            <FlexBlock
              direction="column"
              justifyContent="center"
              alignItems="center"
              gap={4}
              className={styles.innerPotentialProfitBlock}
            >
              <Subtitle level={2} weight="medium">
                {round(2 * 365 * Number(value))}
              </Subtitle>
              <FlexBlock gap={8} alignItems="center">
                <PointCoinIcon size={16} />
                <Caption weight="regular">Points</Caption>
              </FlexBlock>
            </FlexBlock>
          </FlexBlock>
        </FlexBlock>
      </div>

      <FlexBlock gap={16} alignItems="center" block>
        <Button variant="text" fullWidth size="lg" onClick={close} disabled={isWithdrawingLoading}>
          Cancel
        </Button>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={handleButtonClick}
          disabled={isWithdrawingLoading || !withdrawValue || isMoreThanBalance}
        >
          {isNeedSwitch ? 'Switch network' : 'Confirm'}
        </Button>
      </FlexBlock>
    </FlexBlock>
  );
};
