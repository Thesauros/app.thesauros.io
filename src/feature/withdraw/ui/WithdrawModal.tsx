import { vaults } from '@/shared/blockchain/config';
import { FlexBlock } from '@/shared/ui/flex-block';
import { CloseIcon } from '@/shared/ui/icons/close';
import { useModal } from '@/shared/ui/modal';
import { useMemo, useState } from 'react';
import styles from './WithdrawModal.module.scss';
import { InputComponent } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { useAccount } from 'wagmi';
import { useSwitchNetwork } from '@/shared/blockchain/core/useSwtichNetwork';
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
import { useVaultsPosition } from '@/shared/blockchain';
import { useQueryClient } from '@tanstack/react-query';

export const WithdrawModal = () => {
  const { close, open } = useModal();
  const [value, setValue] = useState('');
  const { address, chainId } = useAccount();

  const choosenVault = vaults.find(vault => vault.chainID === chainId) ?? vaults[0];

  const withdrawValue = Number(value) * 10 ** choosenVault.decimals;

  const apy = useOnchainCurrentAPY({
    vaultAddress: vaults[0].vaultAddress,
    chainID: vaults[0].chainID,
  });

  const queryClient = useQueryClient();
  const { refetchData: refetchVaultsPosition } = useVaultsPosition();

  const { withdraw, isWithdrawingLoading } = useWithdraw({
    vaultAddress: choosenVault.vaultAddress,
    chainID: choosenVault.chainID,
    args: [withdrawValue, address, address],
    onSuccess: data => {
      open(
        <TransactionStatusModal
          data={data}
          amount={Number(value)}
          coinName={choosenVault.coinName}
          status="success"
          type="withdraw"
        />
      );
      // Wait for transaction to be confirmed before refetching
      // Try multiple times to ensure data is updated
      const refetchData = () => {
        refetchVaultsPosition();
        refetchCoinBalance();
        // Invalidate all contract read queries to refresh dashboard
        queryClient.invalidateQueries({ queryKey: ['readContract'] });
      };

      // Immediate refetch
      refetchData();

      // Refetch after 2 seconds (transaction might be confirmed)
      setTimeout(refetchData, 2000);

      // Refetch after 5 seconds (transaction should be confirmed by now)
      setTimeout(refetchData, 5000);
    },
    onError: error => {
      if (error) open(<TransactionStatusModal status="failed" type="withdraw" />);
    },
  });

  const { isNeedSwitch, switchNetwork } = useSwitchNetwork({
    targetChainID: choosenVault.chainID,
  });

  const { data: coinBalance, refetch: refetchCoinBalance } = useContractRead({
    address: choosenVault.vaultAddress,
    functionName: 'getBalanceOfAsset',
    args: [address],
    chainID: choosenVault.chainID,
    watch: true,
    selectData: (data: unknown): number => {
      return round(Number(data) / 10 ** choosenVault.decimals, 2);
    },
  });

  const { data: feePercent } = useContractRead({
    address: choosenVault.vaultAddress,
    functionName: 'withdrawFeePercent',
    chainID: choosenVault.chainID,
    selectData: (data: unknown): number => {
      return round(Number(data) / 10 ** choosenVault.decimals, 2);
    },
  });

  const userCoinBalance: number = useMemo(() => {
    if (typeof coinBalance === 'number') {
      return coinBalance;
    }
    return 0;
  }, [coinBalance]);

  const isMoreThenBalance = Number(value) > userCoinBalance;

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
              {choosenVault.coinName}
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
            Avialable:
          </Caption>
          <div style={{ cursor: 'pointer' }} onClick={() => setValue(String(userCoinBalance))}>
            <Body level={2} weight="regular">
              {round(userCoinBalance)} {choosenVault.coinName}
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
                <Caption weight="regular">{choosenVault.coinName}</Caption>
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
                {round(365 * Number(value))}
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
        <Button
          variant="text"
          fullWidth
          size="lg"
          onClick={() => close()}
          disabled={isWithdrawingLoading}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => {
            if (isNeedSwitch) {
              switchNetwork(choosenVault.chainID);
            } else {
              withdraw();
            }
          }}
          disabled={isWithdrawingLoading || !withdrawValue || isMoreThenBalance}
        >
          {isNeedSwitch ? 'Switch network' : 'Confirm'}
        </Button>
      </FlexBlock>
    </FlexBlock>
  );
};
