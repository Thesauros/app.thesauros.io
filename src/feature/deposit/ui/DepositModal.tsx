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
import { useUserPointsInfo } from '@/shared/api/pointProgram';
import { useMinAmount, useVaultsPosition } from '@/shared/blockchain';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';

export const DepositModal = () => {
  const { open, close } = useModal();
  const [value, setValue] = useState('');
  const { address, chainId } = useAccount();

  const choosenVault = vaults.find(vault => vault.chainID === chainId) ?? vaults[0];

  const { data: minAmount } = useMinAmount({
    vaultAddress: choosenVault.vaultAddress,
    chainID: choosenVault.chainID,
    decimals: choosenVault.decimals,
  });

  const { data: feePercent } = useContractRead({
    address: choosenVault.vaultAddress,
    functionName: 'withdrawFeePercent',
    chainID: choosenVault.chainID,
    selectData: (data: unknown): number => {
      return round(Number(data) / 10 ** choosenVault.decimals, 2);
    },
  });

  const depositValue = isNaN(Number(value) * 10 ** choosenVault.decimals)
    ? 0
    : Number(value) * 10 ** choosenVault.decimals;

  const { refetchUserPointsInfo } = useUserPointsInfo(address);
  const { refetchData: refetchVaultsPosition } = useVaultsPosition();

  const { deposit, isDepositLoading } = useDeposit({
    vaultAddress: choosenVault.vaultAddress,
    chainID: choosenVault.chainID,
    args: [depositValue, address],
    onSuccess: data => {
      open(
        <TransactionStatusModal
          data={data}
          amount={Number(value)}
          coinName={choosenVault.coinName}
          status="success"
          type="deposit"
        />
      );
      refetchUserPointsInfo();
      refetchVaultsPosition();
    },
    onError: error => {
      if (error) open(<TransactionStatusModal status="failed" type="deposit" />);
    },
  });

  const { approve, isApproved } = useApprove({
    tokenAddress: choosenVault.coinAddress,
    vaultAddress: choosenVault.vaultAddress,
    userValue: Number(depositValue),
    chainID: choosenVault.chainID,
  });

  const { isNeedSwitch, switchNetwork } = useSwitchNetwork({
    targetChainID: choosenVault.chainID,
  });

  const { data: coinBalance } = useContractRead({
    address: choosenVault.coinAddress,
    functionName: 'balanceOf',
    args: [address],
    chainID: choosenVault.chainID,
    watch: true,
    selectData: (data: unknown): number => {
      return round(Number(data) / 10 ** choosenVault.decimals, 2);
    },
  });

  const apy = useOnchainCurrentAPY({
    vaultAddress: choosenVault.vaultAddress,
    chainID: choosenVault.chainID,
  });

  const userCoinBalance: number = useMemo(() => {
    if (typeof coinBalance === 'number') {
      return coinBalance;
    }
    return 0;
  }, [coinBalance]);

  const isMoreThenBalance = Number(value) > userCoinBalance;
  const isLessThanMinAmount =
    minAmount !== undefined && Number(value) > 0 && Number(value) < minAmount;
  const { complexApy } = useDashboardConstants();

  return (
    <FlexBlock direction="column" gap={16} block>
      {/* Header */}
      <FlexBlock justifyContent="space-between" alignItems="center" block>
        <FlexBlock gap={8} alignItems="center">
          <UsdcIcon size={33} />
          <Heading level={6} weight="regular">
            Deposit {choosenVault.coinName}
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
          <Subtitle level={2}>{complexApy.netApy}%</Subtitle>
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
      </FlexBlock>

      {/*  Deposit Input*/}

      <FlexBlock direction="column" gap={4} block>
        <Caption>Amount to Deposit</Caption>
        <InputComponent
          id="id"
          value={value}
          type="number"
          size="md"
          postfix={
            <Body level={2} weight="regular" className={styles.secondary}>
              {choosenVault.coinName}
            </Body>
          }
          fullWidth
          onChange={setValue}
          disabled={isDepositLoading}
        />
      </FlexBlock>

      {/*  Balance block */}
      <FlexBlock direction="column" gap={8} block>
        <FlexBlock alignItems="center" justifyContent="space-between" block>
          <Caption weight="regular" className={styles.secondary}>
            Balance:
          </Caption>
          <div style={{ cursor: 'pointer' }} onClick={() => setValue(String(userCoinBalance))}>
            <Body level={2} weight="regular">
              {userCoinBalance} {choosenVault.coinName}
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
              {formatNumberWithCommas(Number(value) * 365)}
            </Body>
          </FlexBlock>
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
              ${round((apy * (Number(value) / 100)) / 12)}
            </Body>
          </FlexBlock>
          <FlexBlock alignItems="center" justifyContent="space-between" block>
            <Caption weight="regular" className={styles.secondary}>
              Yearly profit
            </Caption>
            <Body level={2} weight="regular">
              ${round(apy * (Number(value) / 100))}
            </Body>
          </FlexBlock>
        </FlexBlock>
        <div className={styles.divider} />
        {/* Fee Block */}
        <FlexBlock alignItems="center" justifyContent="space-between" block>
          <Caption weight="regular" className={styles.secondary}>
            Withdrawal fee
          </Caption>
          <Body level={2} weight="regular">
            {round(Number(feePercent))}%
          </Body>
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
                <SwapWidget
                  coinAddress={choosenVault.coinAddress}
                  chainID={choosenVault.chainID}
                />,
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
            switchNetwork(choosenVault.chainID);
          } else if (isApproved) {
            deposit();
          } else {
            approve();
          }
        }}
        fullWidth
        disabled={isDepositLoading || !depositValue || isMoreThenBalance || isLessThanMinAmount}
      >
        {isLessThanMinAmount
          ? `Minimum amount is ${minAmount} ${choosenVault.coinName}`
          : isNeedSwitch
            ? 'Switch network'
            : isApproved
              ? `Deposit ${value} ${choosenVault.coinName}`
              : 'Approve'}
      </Button>

      {/* First deposit block */}
      <FlexBlock alignItems="center" gap={8} justifyContent="center">
        <Body level={2} weight="regular">
          +500
        </Body>
        <PointCoinIcon size={16} />
        <Body level={2} weight="regular">
          Points bonus for your first deposit
        </Body>
      </FlexBlock>
    </FlexBlock>
  );
};
