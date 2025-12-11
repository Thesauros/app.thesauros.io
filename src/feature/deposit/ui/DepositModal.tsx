import { vaults } from '@/shared/blockchain/config';
import { FlexBlock } from '@/shared/ui/flex-block';
import { CloseIcon } from '@/shared/ui/icons/close';
import { useModal } from '@/shared/ui/modal';
import { useMemo, useState } from 'react';
import styles from './DepositModal.module.scss';
import { InputComponent } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { useDeposit } from '@/feature/deposit/model/useDeposit';

import { useAccount } from 'wagmi';
import { useApprove } from '@/shared/blockchain/useApprove';
import { useSwitchNetwork } from '@/shared/blockchain/core/useSwtichNetwork';
import { round } from '@/shared/number/round';
import { useContractRead } from '@/shared/blockchain/core/useContractRead';
import { SwapWidget } from '@/widgets/swap';
import { Heading } from '@/shared/ui/new-typography/heading';
import { UsdcIcon } from '@/shared/ui/icons/usdc-icon';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Body } from '@/shared/ui/new-typography/body';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import { PointCoinIcon } from '@/shared/ui/icons/point-icon';
import { InfoCircleIcon } from '@/shared/ui/icons/info-circle';
import { SwapIcon } from '@/shared/ui/icons/swap';
import { useOnchainCurrentAPY } from '@/shared/blockchain/useOnchainCurrentAPY';
import { TransactionStatusModal } from '@/shared/ui/transaction-status-modal';
import { formatNumberWithCommas } from '@/shared/number/formatNumberWithCommas';
import { useDashboardConstants } from '@/shared/constants/dashboard-constants';
import { useMinAmount, useVaultsPosition } from '@/shared/blockchain';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { useQueryClient } from '@tanstack/react-query';
import { useTaskStatuses } from '@/shared/api/pointProgram/useTaskStatuses';
import { useCurrentSeason } from '@/shared/api/pointProgram/useCurrentSeasonId';

type DepositValue = {
  formatted: string;
  raw: number;
};

export const DepositModal = () => {
  const { open, close } = useModal();
  const [value, setValue] = useState<DepositValue>({ formatted: '', raw: 0 });
  const { address, chainId } = useAccount();

  const chosenVault = vaults.find(vault => vault.chainID === chainId) ?? vaults[0];

  const { data: minAmount } = useMinAmount({
    vaultAddress: chosenVault.vaultAddress,
    chainID: chosenVault.chainID,
    decimals: chosenVault.decimals,
  });

  const depositValue = isNaN(value.raw * 10 ** chosenVault.decimals)
    ? 0
    : value.raw * 10 ** chosenVault.decimals;

  const handleValueChange = (newValue: string) => {
    const numericValue = newValue === '' ? 0 : parseFloat(newValue);
    setValue({
      formatted: newValue,
      raw: isNaN(numericValue) ? 0 : numericValue,
    });
  };

  const queryClient = useQueryClient();
  const { refetchData: refetchVaultsPosition } = useVaultsPosition();
  const { userTaskStatuses } = useTaskStatuses(address);
  const { seasonInfo } = useCurrentSeason();

  // Find first deposit task by ID (first_deposit)
  const firstDepositTask = useMemo(() => {
    return seasonInfo?.season.tasks?.find(task => task.id === 'first_deposit');
  }, [seasonInfo?.season.tasks]);

  // Check if first deposit task is completed
  const isFirstDepositTaskCompleted = useMemo(() => {
    if (!firstDepositTask?.id || !userTaskStatuses?.tasks) {
      return false;
    }
    return userTaskStatuses.tasks[firstDepositTask.id] === 'done';
  }, [firstDepositTask?.id, userTaskStatuses?.tasks]);

  const { deposit, isDepositLoading } = useDeposit({
    vaultAddress: chosenVault.vaultAddress,
    chainID: chosenVault.chainID,
    args: [depositValue, address],
    onSuccess: data => {
      open(
        <TransactionStatusModal
          data={data}
          amount={value.raw}
          coinName={chosenVault.coinName}
          status="success"
          type="deposit"
        />
      );
      // Wait for transaction to be confirmed before refetching
      // Try multiple times to ensure data is updated
      const refetchData = () => {
        refetchVaultsPosition();
        refetchCoinBalance();
        refetchTokenBalance();
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
      if (error) open(<TransactionStatusModal status="failed" type="deposit" />);
    },
  });

  const { approve, isApproved } = useApprove({
    tokenAddress: chosenVault.coinAddress,
    vaultAddress: chosenVault.vaultAddress,
    userValue: Number(depositValue),
    chainID: chosenVault.chainID,
  });

  const { isNeedSwitch, switchNetwork } = useSwitchNetwork({
    targetChainID: chosenVault.chainID,
  });

  const { data: coinBalance, refetch: refetchCoinBalance } = useContractRead({
    address: chosenVault.coinAddress,
    functionName: 'balanceOf',
    args: [address],
    chainID: chosenVault.chainID,
    watch: true,
    selectData: (data: unknown): { rawValue: number; value: number } => {
      return {
        rawValue: Number(data),
        value: round(Number(data) / 10 ** chosenVault.decimals, 2),
      };
    },
  });

  const { data: tokenBalance, refetch: refetchTokenBalance } = useContractRead({
    address: chosenVault.vaultAddress,
    functionName: 'getBalanceOfAsset',
    args: [address],
    chainID: chosenVault.chainID,
    watch: true,
    selectData: (data: unknown): number => {
      return round(Number(data) / 10 ** chosenVault.decimals, 2);
    },
  });

  const apy =
    useOnchainCurrentAPY({
      vaultAddress: chosenVault.vaultAddress,
      chainID: chosenVault.chainID,
    }) ?? 0;

  const userCoinBalance: number = useMemo(() => {
    if (
      coinBalance &&
      typeof coinBalance === 'object' &&
      coinBalance !== null &&
      'value' in coinBalance &&
      typeof (coinBalance as { value: unknown }).value === 'number'
    ) {
      return (coinBalance as { value: number }).value;
    }
    return 0;
  }, [coinBalance]);

  const userCoinBalanceRaw: number = useMemo(() => {
    if (
      coinBalance &&
      typeof coinBalance === 'object' &&
      coinBalance !== null &&
      'rawValue' in coinBalance &&
      typeof (coinBalance as { rawValue: unknown }).rawValue === 'number'
    ) {
      // Divide by decimals to get human-readable value with full precision
      return (coinBalance as { rawValue: number }).rawValue / 10 ** chosenVault.decimals;
    }
    return 0;
  }, [coinBalance, chosenVault.decimals]);

  const setMaxValue = () => {
    setValue({
      formatted: String(userCoinBalanceRaw),
      raw: userCoinBalanceRaw,
    });
  };

  const isMoreThanBalance = Number(value.formatted) > userCoinBalance;
  const isLessThanMinAmount =
    minAmount !== undefined && Number(value.formatted) > 0 && Number(value.formatted) < minAmount;
  const { complexApy } = useDashboardConstants();

  return (
    <FlexBlock direction="column" gap={16} block>
      {/* Header */}
      <FlexBlock justifyContent="space-between" alignItems="center" block>
        <FlexBlock gap={8} alignItems="center">
          <UsdcIcon size={33} />
          <Heading level={6} weight="regular">
            Deposit {chosenVault.coinName}
          </Heading>
        </FlexBlock>
        <CloseIcon onClick={close} />
      </FlexBlock>

      {/* APY area */}
      <FlexBlock gap={8} block>
        <FlexBlock
          alignItems="center"
          justifyContent="space-between"
          block
          className={styles.apyBlock}
        >
          <Caption weight="regular" className={styles.secondary}>
            Net APY
          </Caption>
          <Subtitle level={2} weight="bold" className={styles.highlight}>
            {complexApy.netApy}%
          </Subtitle>
        </FlexBlock>
        <FlexBlock
          alignItems="center"
          justifyContent="space-between"
          block
          className={styles.apyBlock}
        >
          <Caption weight="regular" className={styles.secondary}>
            Reward APY
          </Caption>
          <Subtitle level={2}>{complexApy.rewardApy}%</Subtitle>
        </FlexBlock>
        <FlexBlock
          alignItems="center"
          justifyContent="space-between"
          block
          className={styles.apyBlock}
        >
          <Caption weight="regular" className={styles.secondary}>
            Base APY
          </Caption>
          <Subtitle level={2}>{complexApy.baseApy}%</Subtitle>
        </FlexBlock>
      </FlexBlock>

      {/*  Deposit Input*/}

      <FlexBlock direction="column" gap={4} block>
        <Caption>Amount to Deposit</Caption>
        <InputComponent
          id="id"
          value={value.formatted}
          type="number"
          size="md"
          postfix={
            <Body level={2} weight="regular" className={styles.secondary}>
              {chosenVault.coinName}
            </Body>
          }
          fullWidth
          onChange={handleValueChange}
          disabled={isDepositLoading}
        />
      </FlexBlock>

      {/*  Balance block */}
      <FlexBlock direction="column" gap={8} block>
        <FlexBlock alignItems="center" justifyContent="space-between" block>
          <Caption weight="regular" className={styles.secondary}>
            Balance:
          </Caption>
          <div style={{ cursor: 'pointer' }} onClick={setMaxValue}>
            <Body level={2} weight="regular">
              {userCoinBalance} {chosenVault.coinName}
            </Body>
          </div>
        </FlexBlock>
        <FlexBlock alignItems="center" justifyContent="space-between" block>
          <Tooltip
            tooltipText="You receive 1 point for every $1 you hold each day.
 For example, holding 1,000 USDC for one year gives you about 365,000 points."
            withIcon
          >
            <Caption weight="regular" className={styles.secondary}>
              Total points per year
            </Caption>
          </Tooltip>
          <FlexBlock gap={2} alignItems="center">
            <PointCoinIcon size={16} />
            <Body level={2} weight="regular">
              {formatNumberWithCommas(Number(value.formatted) * 365)}
            </Body>
          </FlexBlock>
        </FlexBlock>
        <FlexBlock alignItems="center" justifyContent="space-between" block>
          <Caption weight="regular" className={styles.secondary}>
            Performance fee
          </Caption>
          <div>
            <Body level={2} weight="regular">
              ≈0.054%/Day
            </Body>
          </div>
        </FlexBlock>
      </FlexBlock>

      <div className={styles.earningsBlock}>
        <Caption weight="regular">Projected Earnings</Caption>
        {/* Projected Earnings */}

        <FlexBlock direction="column" gap={6} block>
          <FlexBlock alignItems="center" justifyContent="space-between" block>
            <Caption weight="regular" className={styles.secondary}>
              Monthly profit
            </Caption>
            <Body level={2} weight="regular">
              ${round((apy * (Number(value.formatted) / 100)) / 12, 2)}
            </Body>
          </FlexBlock>
          <FlexBlock alignItems="center" justifyContent="space-between" block>
            <Caption weight="regular" className={styles.secondary}>
              Yearly profit
            </Caption>
            <Body level={2} weight="regular">
              ${round(apy * (Number(value.formatted) / 100), 2)}
            </Body>
          </FlexBlock>
        </FlexBlock>
      </div>
      {/* Swap Block */}
      {userCoinBalance < 10 && (
        <div className={styles.swapBlock}>
          <FlexBlock alignItems="center">
            <InfoCircleIcon />
            <Caption weight="regular">Low on USDC? Swap from any token</Caption>
          </FlexBlock>
          <Button
            variant="text"
            prefix={<SwapIcon />}
            onClick={() => {
              open(
                <SwapWidget coinAddress={chosenVault.coinAddress} chainID={chosenVault.chainID} />,
                { withLayout: false }
              );
            }}
          >
            Swap
          </Button>
        </div>
      )}

      {/* Deposit button block */}
      <Button
        size="lg"
        onClick={() => {
          if (isNeedSwitch) {
            switchNetwork(chosenVault.chainID);
          } else if (isApproved) {
            deposit();
          } else {
            approve();
          }
        }}
        fullWidth
        disabled={isDepositLoading || !depositValue || isMoreThanBalance || isLessThanMinAmount}
      >
        {isLessThanMinAmount
          ? `Minimum amount is ${minAmount} ${chosenVault.coinName}`
          : isNeedSwitch
            ? 'Switch network'
            : isApproved
              ? `Deposit ${value.formatted || 0} ${chosenVault.coinName}`
              : 'Approve'}
      </Button>

      {/* First deposit block */}
      {/* 
        Show only if:
        1. User has no deposit (tokenBalance === 0)
        2. AND user hasn't completed the first deposit task yet
        Even if user withdraws all funds and balance becomes 0, 
        if they already completed the task, this block won't show
      */}
      {Number(tokenBalance) === 0 && !isFirstDepositTaskCompleted && (
        <FlexBlock alignItems="center" gap={8} justifyContent="center">
          <Body level={2} weight="regular">
            +500
          </Body>
          <PointCoinIcon size={16} />
          <Body level={2} weight="regular">
            Points bonus for your first deposit
          </Body>
        </FlexBlock>
      )}
    </FlexBlock>
  );
};
