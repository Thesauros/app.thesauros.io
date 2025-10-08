import { vaults } from '@/shared/blockchain/config';
import { Card } from '@/shared/ui/card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { CloseIcon } from '@/shared/ui/icons/close';
import { useModal } from '@/shared/ui/modal';
import { Texting } from '@/shared/ui/typography/texting';
import { useMemo, useState } from 'react';
import styles from './WithdrawModal.module.scss';
import classNames from 'classnames';
import { InputComponent } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { TAddress, TVault } from '@/shared/blockchain/core/types';

import { useAccount } from 'wagmi';
import { useApprove } from '@/shared/blockchain/useApprove';
import { useSwitchNetwork } from '@/shared/blockchain/core/useSwtichNetwork';
import { round } from '@/shared/number/round';
import { useContractRead } from '@/shared/blockchain/core/useContractRead';
import { useWithdraw } from '../model/useWithdraw';

export const erc20Abi = [
  {
    constant: true,
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
];

export const WithdrawModal = () => {
  const { close } = useModal();
  const [choosenVault, setChoosenVault] = useState<TVault>(vaults[0]);
  const [value, setValue] = useState('');
  const { address } = useAccount();

  const withdrawValue = Number(value) * 10 ** choosenVault.decimals;

  const { withdraw, isWithdrawingLoading } = useWithdraw({
    vaultAddress: choosenVault.vaultAddress,
    chainID: choosenVault.chainID,
    args: [withdrawValue, address, address],
  });

  const { approve, isApproved } = useApprove({
    tokenAddress: choosenVault.vaultAddress,
    vaultAddress: address as TAddress,
    userValue: Number(withdrawValue),
    chainID: choosenVault.chainID,
  });

  const { isNeedSwitch, switchNetwork } = useSwitchNetwork({
    targetChainID: choosenVault.chainID,
  });

  const { data: coinBalance } = useContractRead({
    address: choosenVault.vaultAddress,
    functionName: 'balanceOf',
    args: [address],
    chainID: choosenVault.chainID,
    watch: true,
    selectData: (data: unknown): number => {
      return round(Number(data) / 10 ** choosenVault.decimals, 2);
    },
  });

  const { data: symbol } = useContractRead({
    address: choosenVault.vaultAddress,
    functionName: 'symbol',
    watch: false,
    chainID: choosenVault.chainID,
  });

  const { data: withdrawFeePercent } = useContractRead({
    address: choosenVault.vaultAddress,
    functionName: 'withdrawFeePercent',
    watch: false,
    chainID: choosenVault.chainID,
    selectData: (data: unknown): number => {
      const raw = Number(data);
      const denominator = raw > 1_000_000 ? 1e18 : 1e4;
      return raw / denominator;
    },
  });

  const userCoinBalance: number = useMemo(() => {
    if (typeof coinBalance === 'number') {
      return coinBalance;
    }
    return 0;
  }, [coinBalance]);

  const withdrawFeeAmountTokens: number = useMemo(() => {
    const amountTokens = Number(value || 0);
    const feeFraction = typeof withdrawFeePercent === 'number' ? withdrawFeePercent : 0;
    return round(amountTokens * feeFraction, 6);
  }, [value, withdrawFeePercent]);

  const handlePercentageClick = (percentage: number) => {
    if (percentage === 100) {
      setValue(String(userCoinBalance));
    } else {
      const amount = (userCoinBalance * percentage) / 100;
      setValue(String(amount.toFixed(2)));
    }
  };

  return (
    <FlexBlock direction="column" gap={28} block>
      <FlexBlock justifyContent="space-between" alignItems="center" block>
        <Texting level={1}>Withdraw Funds</Texting>
        <FlexBlock gap={12} alignItems="center">
          <CloseIcon onClick={close} />
        </FlexBlock>
      </FlexBlock>
      {vaults.length > 1 && (
        <FlexBlock direction="column" gap={16} block>
          <Texting level={2}>Vaults</Texting>
          <FlexBlock block alignItems="center">
            {vaults.map(({ vaultAddress, coinName }) => (
              <Card
                size="s"
                key={vaultAddress}
                className={classNames(
                  styles.vaultButton,
                  choosenVault.vaultAddress === vaultAddress ? styles.active : ''
                )}
                onClick={() =>
                  setChoosenVault(
                    vaults.find(vault => vault.vaultAddress === vaultAddress) ?? vaults[0]
                  )
                }
              >
                {coinName}
              </Card>
            ))}
          </FlexBlock>
        </FlexBlock>
      )}

      <FlexBlock direction="column" gap={16} block>
        <Texting level={2}>Amount</Texting>
        <FlexBlock direction="column" gap={12} block>
          <InputComponent
            id="amount"
            variant="secondary"
            value={value}
            type="number"
            placeholder="$0.00"
            onChange={setValue}
            disabled={isWithdrawingLoading}
          />

          <FlexBlock gap={8} block>
            <Card
              size="s"
              onClick={() => handlePercentageClick(25)}
              className={styles.percentageButton}
            >
              25%
            </Card>
            <Card
              size="s"
              onClick={() => handlePercentageClick(50)}
              className={styles.percentageButton}
            >
              50%
            </Card>
            <Card
              size="s"
              onClick={() => handlePercentageClick(75)}
              className={styles.percentageButton}
            >
              75%
            </Card>
            <Card
              size="s"
              onClick={() => handlePercentageClick(100)}
              className={styles.percentageButton}
            >
              Max
            </Card>
          </FlexBlock>

          <FlexBlock justifyContent="space-between" alignItems="center" block>
            <Texting level={3}>Available:</Texting>
            <Texting level={3}>
              {userCoinBalance ?? 0} {(symbol as string) ?? ''}
            </Texting>
          </FlexBlock>

          <FlexBlock justifyContent="space-between" alignItems="center" block>
            <Texting level={3}>Withdrawal Fee:</Texting>
            <Texting level={3}>
              {withdrawFeeAmountTokens.toFixed(3)} {(symbol as string) ?? ''}
            </Texting>
          </FlexBlock>
        </FlexBlock>
      </FlexBlock>

      <FlexBlock gap={16} alignItems="center" className={styles.buttonContainer} block>
        <Button variant="secondary" onClick={() => close()} disabled={isWithdrawingLoading}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (isNeedSwitch) {
              switchNetwork(choosenVault.chainID);
            } else if (isApproved) {
              withdraw();
            } else {
              approve();
            }
          }}
          disabled={isWithdrawingLoading}
        >
          {isNeedSwitch ? 'Switch network' : isApproved ? 'Confirm' : 'Approve'}
        </Button>
      </FlexBlock>
    </FlexBlock>
  );
};
