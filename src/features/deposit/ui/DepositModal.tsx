import { FlexBlock } from '@/shared/ui/flex-block';
import { CloseIcon } from '@/shared/ui/icons/close';
import { useModal } from '@/shared/ui/modal';
import { useCallback, useMemo, useState } from 'react';
import styles from './DepositModal.module.scss';
import { InputComponent } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { useDeposit } from '@/features/deposit/model/useDeposit';
import { useApprove } from '@/shared/blockchain/useApprove';
import { useSwitchNetwork } from '@/shared/blockchain/core/useSwitchNetwork';
import { round } from '@/shared/number/round';
import { useContractRead } from '@/shared/blockchain/core/useContractRead';
import { useBalanceOfAsset } from '@/shared/blockchain/useBalanceOfAsset';
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
import {
  useMinAmount,
  useSelectedVault,
  useRefetchAfterTransaction,
  useAccount,
  usePerformanceFee,
  PUBLISHED_PERFORMANCE_FEE_PERCENT,
} from '@/shared/blockchain';
import { useTaskStatuses } from '@/shared/api/pointProgram/useTaskStatuses';
import { useCurrentSeason } from '@/shared/api/pointProgram/useCurrentSeasonId';
import { StepsProgress, Step } from '@/shared/ui/steps-progress';

type DepositValue = {
  formatted: string;
  raw: number;
};

type CoinBalance = {
  rawValue: number;
  value: number;
};

export const DepositModal = () => {
  const { open, close } = useModal();
  const [value, setValue] = useState<DepositValue>({ formatted: '', raw: 0 });
  const { address } = useAccount();

  const selectedVault = useSelectedVault();
  const { createRefetchWithCallbacks } = useRefetchAfterTransaction();

  const { data: minAmount } = useMinAmount({
    vaultAddress: selectedVault.vaultAddress,
    chainID: selectedVault.chainID,
    decimals: selectedVault.decimals,
  });

  const depositValue = isNaN(value.raw * 10 ** selectedVault.decimals)
    ? 0
    : value.raw * 10 ** selectedVault.decimals;

  const handleValueChange = useCallback((newValue: string) => {
    if (newValue === '') {
      setValue({ formatted: '', raw: 0 });
      return;
    }

    const numericValue = parseFloat(newValue);

    let formatted = newValue;
    if (newValue.includes('.')) {
      const [intPart, decPart] = newValue.split('.');
      const normalizedInt = intPart === '' ? '0' : String(parseInt(intPart, 10) || 0);
      formatted = `${normalizedInt}.${decPart}`;
    } else {
      formatted = String(parseInt(newValue, 10) || 0);
    }

    setValue({
      formatted,
      raw: isNaN(numericValue) ? 0 : numericValue,
    });
  }, []);

  const selectCoinBalance = useCallback(
    (data: unknown): CoinBalance => ({
      rawValue: Number(data),
      value: round(Number(data) / 10 ** selectedVault.decimals, 2),
    }),
    [selectedVault.decimals]
  );

  const selectTokenBalance = useCallback(
    (data: unknown): number => round(Number(data) / 10 ** selectedVault.decimals, 2),
    [selectedVault.decimals]
  );

  const { userTaskStatuses } = useTaskStatuses(address);
  const { seasonInfo } = useCurrentSeason();

  const firstDepositTask = useMemo(() => {
    return seasonInfo?.season.tasks?.find(task => task.id === 'first_deposit');
  }, [seasonInfo?.season.tasks]);

  const isFirstDepositTaskCompleted = useMemo(() => {
    if (!firstDepositTask?.id || !userTaskStatuses?.tasks) {
      return false;
    }
    return userTaskStatuses.tasks[firstDepositTask.id].status === 'done';
  }, [firstDepositTask?.id, userTaskStatuses?.tasks]);

  const {
    approve,
    isApproved,
    isLoading: isApproveLoading,
  } = useApprove({
    tokenAddress: selectedVault.coinAddress,
    vaultAddress: selectedVault.vaultAddress,
    userValue: Number(depositValue),
    chainID: selectedVault.chainID,
  });

  const { data: coinBalance, refetch: refetchCoinBalance } = useContractRead({
    address: selectedVault.coinAddress,
    functionName: 'balanceOf',
    args: [address],
    chainID: selectedVault.chainID,
    staleTime: 30000,
    selectData: selectCoinBalance,
  });

  const { data: tokenBalance, refetch: refetchTokenBalance } = useBalanceOfAsset({
    vaultAddress: selectedVault.vaultAddress,
    account: address,
    chainID: selectedVault.chainID,
    staleTime: 30000,
    selectData: selectTokenBalance,
  });

  const refetchAfterDeposit = createRefetchWithCallbacks(refetchCoinBalance, refetchTokenBalance);

  const { deposit, isDepositLoading } = useDeposit({
    vaultAddress: selectedVault.vaultAddress,
    chainID: selectedVault.chainID,
    args: [depositValue, address],
    enabled: isApproved,
    onSuccess: data => {
      open(
        <TransactionStatusModal
          data={data}
          amount={value.raw}
          coinName={selectedVault.coinName}
          status="success"
          type="deposit"
          chainId={selectedVault.chainID}
        />
      );
      refetchAfterDeposit();
    },
    onError: error => {
      if (error)
        open(
          <TransactionStatusModal status="failed" type="deposit" chainId={selectedVault.chainID} />
        );
    },
  });

  const { isNeedSwitch, switchNetwork } = useSwitchNetwork({
    targetChainID: selectedVault.chainID,
  });

  const apy =
    useOnchainCurrentAPY({
      vaultAddress: selectedVault.vaultAddress,
      chainID: selectedVault.chainID,
    }) ?? 0;

  const { data: performanceFee } = usePerformanceFee({
    vaultAddress: selectedVault.vaultAddress,
    chainID: selectedVault.chainID,
  });

  const performanceFeePercent = performanceFee ?? PUBLISHED_PERFORMANCE_FEE_PERCENT;
  const netApy = round(apy * (1 - performanceFeePercent / 100));

  const userCoinBalance = useMemo(() => {
    return (coinBalance as CoinBalance | undefined)?.value ?? 0;
  }, [coinBalance]);

  const userCoinBalanceRaw = useMemo(() => {
    const rawValue = (coinBalance as CoinBalance | undefined)?.rawValue;
    if (rawValue !== undefined) {
      return rawValue / 10 ** selectedVault.decimals;
    }
    return 0;
  }, [coinBalance, selectedVault.decimals]);

  const setMaxValue = useCallback(() => {
    setValue({
      formatted: String(userCoinBalance),
      raw: userCoinBalanceRaw,
    });
  }, [userCoinBalance, userCoinBalanceRaw]);

  const isMoreThanBalance = Number(value.formatted) > userCoinBalance;

  const isLessThanMinAmount =
    minAmount !== undefined && Number(value.formatted) > 0 && Number(value.formatted) < minAmount;

  const steps: Step[] = useMemo(() => {
    const approveStatus =
      Number(depositValue) > 0 && isApproved
        ? 'completed'
        : isApproveLoading
          ? 'active'
          : 'pending';

    const depositStatus = isDepositLoading ? 'active' : 'pending';

    return [
      { label: 'Approve', status: approveStatus },
      { label: 'Deposit', status: depositStatus },
    ];
  }, [isApproved, depositValue, isApproveLoading, isDepositLoading]);

  const handleButtonClick = useCallback(() => {
    if (isNeedSwitch) {
      switchNetwork(selectedVault.chainID);
    } else if (isApproved) {
      deposit();
    } else {
      approve();
    }
  }, [isNeedSwitch, switchNetwork, selectedVault.chainID, isApproved, deposit, approve]);

  const buttonText = useMemo(() => {
    if (isLessThanMinAmount) {
      return `Minimum amount is ${minAmount} ${selectedVault.coinName}`;
    }
    if (isNeedSwitch) {
      return 'Switch network';
    }
    if (isApproved) {
      return `Deposit ${value.formatted || 0} ${selectedVault.coinName}`;
    }
    return 'Approve';
  }, [
    isLessThanMinAmount,
    minAmount,
    selectedVault.coinName,
    isNeedSwitch,
    isApproved,
    value.formatted,
  ]);

  const handleSwapClick = useCallback(() => {
    open(<SwapWidget coinAddress={selectedVault.coinAddress} chainID={selectedVault.chainID} />, {
      withLayout: false,
    });
  }, [open, selectedVault.coinAddress, selectedVault.chainID]);

  return (
    <div data-testid="deposit-modal">
      <FlexBlock direction="column" gap={16} block>
        {/* Header */}
        <FlexBlock justifyContent="space-between" alignItems="center" block>
          <FlexBlock gap={8} alignItems="center">
            <UsdcIcon size={33} />
            <Heading level={6} weight="regular">
              Deposit {selectedVault.coinName}
            </Heading>
          </FlexBlock>
          <CloseIcon onClick={close} data-testid="deposit-modal-close" />
        </FlexBlock>

        {/* APY area */}
        <FlexBlock gap={4} direction="column" block>
          <FlexBlock alignItems="center" justifyContent="space-between" block>
            <Caption weight="regular" className={styles.secondary}>
              Base APY
            </Caption>
            <Body level={2} weight="regular">
              {round(apy)}%
            </Body>
          </FlexBlock>
          <FlexBlock alignItems="center" justifyContent="space-between" block>
            <Caption weight="regular" className={styles.secondary}>
              Net APY
            </Caption>
            <Body level={2} weight="regular">
              {netApy}%
            </Body>
          </FlexBlock>
        </FlexBlock>

        {/* Deposit Input */}
        <FlexBlock direction="column" gap={4} block>
          <Caption>Amount to Deposit</Caption>
          <InputComponent
            id="deposit-amount-input"
            name="deposit-amount-input"
            value={value.formatted}
            type="number"
            size="md"
            maxValue={1000000000}
            formatWithCommas
            postfix={
              <Body level={2} weight="regular" className={styles.secondary}>
                {selectedVault.coinName}
              </Body>
            }
            fullWidth
            onChange={handleValueChange}
            disabled={isDepositLoading}
            autoFocus
          />
        </FlexBlock>

        {/* Balance block */}
        <FlexBlock direction="column" gap={8} block>
          <FlexBlock alignItems="center" justifyContent="space-between" block>
            <Caption weight="regular" className={styles.secondary}>
              Balance:
            </Caption>
            <div
              style={{ cursor: 'pointer' }}
              onClick={setMaxValue}
              data-testid="deposit-modal-balance"
            >
              <Body level={2} weight="regular">
                {userCoinBalance} {selectedVault.coinName}
              </Body>
            </div>
          </FlexBlock>
          <FlexBlock alignItems="center" justifyContent="space-between" block>
            <Tooltip
              tooltipText="You receive 2 points for every $1 you hold each day.
For example, holding 1,000 USDC for one year gives you about 730,000 points."
              withIcon
            >
              <Caption weight="regular" className={styles.secondary}>
                Total points per year
              </Caption>
            </Tooltip>
            <FlexBlock gap={2} alignItems="center">
              <PointCoinIcon size={16} />
              <Body level={2} weight="regular">
                {formatNumberWithCommas(Number(value.formatted) * 2 * 365)}
              </Body>
            </FlexBlock>
          </FlexBlock>
          <FlexBlock alignItems="center" justifyContent="space-between" block>
            <Tooltip
              tooltipText="Charged on generated yield only. No fee on your principal, and no management fee."
              withIcon
            >
              <Caption weight="regular" className={styles.secondary}>
                Performance fee
              </Caption>
            </Tooltip>
            <div>
              <Body level={2} weight="regular">
                {performanceFeePercent}% of yield
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
                ${round((netApy * (Number(value.formatted) / 100)) / 12, 2)}
              </Body>
            </FlexBlock>
            <FlexBlock alignItems="center" justifyContent="space-between" block>
              <Caption weight="regular" className={styles.secondary}>
                Yearly profit
              </Caption>
              <Body level={2} weight="regular">
                ${round(netApy * (Number(value.formatted) / 100), 2)}
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
              onClick={handleSwapClick}
              data-testid="deposit-modal-swap-button"
            >
              Swap
            </Button>
          </div>
        )}

        {/* Deposit button block */}
        <Button
          size="lg"
          onClick={handleButtonClick}
          fullWidth
          disabled={isDepositLoading || !depositValue || isMoreThanBalance || isLessThanMinAmount}
          data-testid="deposit-modal-submit-button"
        >
          {buttonText}
        </Button>
        <StepsProgress steps={steps} />

        {/* First deposit block */}
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
    </div>
  );
};
