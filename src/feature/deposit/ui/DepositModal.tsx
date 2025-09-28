import { vaults } from '@/shared/blockchain/config';
import { Card } from '@/shared/ui/card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { CloseIcon } from '@/shared/ui/icons/close';
import { useModal } from '@/shared/ui/modal';
import { Texting } from '@/shared/ui/typography/texting';
import { useMemo, useState } from 'react';
import styles from './DepositModal.module.scss';
import classNames from 'classnames';
import { InputComponent } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { useDeposit } from '@/feature/deposit/model/useDeposit';
import { TVault } from '@/shared/blockchain/core/types';

import { useAccount } from 'wagmi';
import { useApprove } from '@/shared/blockchain/useApprove';
import { useSwitchNetwork } from '@/shared/blockchain/core/useSwtichNetwork';
import { round } from '@/shared/number/round';
import { useContractRead } from '@/shared/blockchain/core/useContractRead';

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

export const DepositModal = () => {
  const { close } = useModal();
  const [choosenVault, setChoosenVault] = useState<TVault>(vaults[0]);
  const [value, setValue] = useState('');
  const { address } = useAccount();

  const depositValue = Number(value) * 10 ** choosenVault.decimals;

  const { deposit, isDepositLoading } = useDeposit({
    vaultAddress: choosenVault.vaultAddress,
    chainID: choosenVault.chainID,
    args: [depositValue, address],
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
    chainID: 42161,
    watch: true,
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

  return (
    <FlexBlock direction="column" gap={28} block>
      <FlexBlock justifyContent="space-between" alignItems="center" block>
        <Texting level={1}>Deposit modal</Texting>
        <CloseIcon onClick={close} />
      </FlexBlock>

      <FlexBlock direction="column" gap={16} block>
        <Texting level={2}>Vaults</Texting>
        <FlexBlock block alignItems="center">
          {vaults.map(({ vaultAddress, coinName, chainName }) => (
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
              <Texting level={2}>{coinName}</Texting>
              <Texting level={4}>{chainName}</Texting>
            </Card>
          ))}
        </FlexBlock>
      </FlexBlock>

      <FlexBlock direction="column" gap={16} block>
        <Texting level={2}>Amount</Texting>
        <FlexBlock direction="column" gap={4} block>
          <InputComponent
            id="id"
            variant="secondary"
            value={value}
            type="number"
            placeholder="$0.00"
            onChange={setValue}
            disabled={isDepositLoading}
          />
          <div
            onClick={() => coinBalance && setValue(String(userCoinBalance))}
            style={{ cursor: 'pointer' }}
          >
            <Texting level={3}>Balance: {userCoinBalance ?? 0}</Texting>
          </div>
        </FlexBlock>
      </FlexBlock>

      <FlexBlock gap={16} alignItems="center" className={styles.buttonContainer} block>
        <Button variant="secondary" onClick={() => close()} disabled={isDepositLoading}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (isNeedSwitch) {
              switchNetwork(choosenVault.chainID);
            } else if (isApproved) {
              deposit();
            } else {
              approve();
            }
          }}
          disabled={isDepositLoading}
        >
          {isNeedSwitch ? 'Switch network' : isApproved ? 'Confirm' : 'Approve'}
        </Button>
      </FlexBlock>
    </FlexBlock>
  );
};
