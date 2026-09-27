import { useMemo, useState } from 'react';
import { parseUnits } from 'viem';
import { useReadContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { SwitchToggle } from '@/shared/ui/switch-toggle';
import { InputComponent } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Body } from '@/shared/ui/new-typography/body';
import { useAccount } from '@/shared/blockchain';
import { CROSSCHAIN } from '@/shared/blockchain/crosschain/config';
import { epochVaultAbi, erc20Abi } from '@/shared/blockchain/crosschain/abi';
import { TCrossChainVault } from '@/shared/api/crosschain';
import { useCrossChainTx } from '@/features/crosschain/model/useCrossChainTx';
import { assetsToShares, fmtUnits, sharesToAssets, shortHash, txUrl } from '../format';
import styles from '../crosschain.module.scss';

const TABS = [
  { title: 'Deposit', value: 0 },
  { title: 'Redeem', value: 1 },
  { title: 'Instant exit', value: 2 },
];

const safeParse = (v: string) => {
  try {
    return v ? parseUnits(v, CROSSCHAIN.decimals) : BigInt(0);
  } catch {
    return BigInt(0);
  }
};

export const ActionPanel = ({ vault }: { vault: TCrossChainVault }) => {
  const [tab, setTab] = useState(TABS[0]);
  const [value, setValue] = useState('');
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const tx = useCrossChainTx();
  const owner = address as `0x${string}` | undefined;

  const usdcBalance = useReadContract({
    address: CROSSCHAIN.assetAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: owner ? [owner] : undefined,
    chainId: CROSSCHAIN.chainId,
    query: { enabled: !!owner },
  });
  const allowance = useReadContract({
    address: CROSSCHAIN.assetAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: owner ? [owner, CROSSCHAIN.vaultAddress] : undefined,
    chainId: CROSSCHAIN.chainId,
    query: { enabled: !!owner },
  });
  const shareBalance = useReadContract({
    address: CROSSCHAIN.vaultAddress,
    abi: epochVaultAbi,
    functionName: 'balanceOf',
    args: owner ? [owner] : undefined,
    chainId: CROSSCHAIN.chainId,
    query: { enabled: !!owner },
  });

  const amount = safeParse(value);
  const rateBid = BigInt(vault.tick.rateBid);
  const rateOffer = BigInt(vault.tick.rateOffer);
  const fee = BigInt(vault.limits.instantFee);
  const WAD = BigInt('1000000000000000000');

  const view = useMemo(() => {
    if (tab.value === 0) {
      const balance = usdcBalance.data ?? BigInt(0);
      const min = BigInt(vault.limits.minDeposit);
      const needsApprove = (allowance.data ?? BigInt(0)) < amount;
      let problem = '';
      if (amount > balance) problem = 'Insufficient USDC balance';
      else if (amount > BigInt(0) && amount < min)
        problem = `Minimum deposit is ${fmtUnits(min)} USDC`;
      return {
        unit: CROSSCHAIN.assetSymbol,
        balance,
        estimate: `≈ ${fmtUnits(assetsToShares(amount, rateOffer), 4)} ${CROSSCHAIN.shareSymbol} at the current offer price`,
        note: 'Your deposit joins the current epoch and is priced at the first NAV tick after the epoch closes. Cancel any time before then.',
        problem,
        needsApprove,
      };
    }
    const balance = shareBalance.data ?? BigInt(0);
    if (tab.value === 1) {
      return {
        unit: CROSSCHAIN.shareSymbol,
        balance,
        estimate: `≈ ${fmtUnits(sharesToAssets(amount, rateBid))} USDC at the current price`,
        note: 'Paid at the lower of the share price at epoch open and at clearing. Shares stop earning while queued; claim once the epoch is funded.',
        problem: amount > balance ? 'Insufficient share balance' : '',
        needsApprove: false,
      };
    }
    const out = sharesToAssets(amount, (rateBid * (WAD - fee)) / WAD);
    const maxCall = BigInt(vault.limits.maxInstantWithdrawal);
    const remaining = BigInt(vault.limits.instantRemainingEstimate);
    let problem = '';
    if (amount > balance) problem = 'Insufficient share balance';
    else if (out > maxCall)
      problem = `Instant exits are limited to ${fmtUnits(maxCall)} USDC per transaction`;
    else if (out > remaining)
      problem = `Only ~${fmtUnits(remaining)} USDC of instant exits left today`;
    else if (vault.tick.frozen) problem = 'Instant exits are paused';
    return {
      unit: CROSSCHAIN.shareSymbol,
      balance,
      estimate: `You receive ≈ ${fmtUnits(out)} USDC now (fee ${(Number(fee) / 1e16).toFixed(2)}%)`,
      note: `Paid immediately from the vault buffer. Up to ${fmtUnits(maxCall)} USDC per transaction, ~${fmtUnits(remaining)} USDC left today.`,
      problem,
      needsApprove: false,
    };
  }, [
    tab.value,
    usdcBalance.data,
    shareBalance.data,
    allowance.data,
    amount,
    rateBid,
    rateOffer,
    fee,
    vault,
    WAD,
  ]);

  const submit = async () => {
    if (!owner || amount === BigInt(0) || view.problem) return;
    if (tab.value === 0) {
      if (view.needsApprove) {
        await tx.send({
          address: CROSSCHAIN.assetAddress,
          abi: erc20Abi,
          functionName: 'approve',
          args: [CROSSCHAIN.vaultAddress, amount],
        });
        allowance.refetch();
        return;
      }
      await tx.send({
        address: CROSSCHAIN.vaultAddress,
        abi: epochVaultAbi,
        functionName: 'requestDeposit',
        args: [amount, owner],
      });
    } else if (tab.value === 1) {
      await tx.send({
        address: CROSSCHAIN.vaultAddress,
        abi: epochVaultAbi,
        functionName: 'requestRedeem',
        args: [amount, owner, owner],
      });
    } else {
      const expected = sharesToAssets(amount, (rateBid * (WAD - fee)) / WAD);
      const minAssets = (expected * BigInt(995)) / BigInt(1000); // tolerate a NAV update in between
      await tx.send({
        address: CROSSCHAIN.vaultAddress,
        abi: epochVaultAbi,
        functionName: 'instantRedeem',
        args: [amount, owner, owner, minAssets],
      });
    }
    setValue('');
  };

  const label = !isConnected
    ? 'Connect wallet'
    : tx.state === 'switching'
      ? 'Switching to Base…'
      : tx.state === 'signing'
        ? 'Confirm in wallet…'
        : tx.state === 'confirming'
          ? 'Waiting for confirmation…'
          : view.needsApprove && tab.value === 0
            ? `Approve ${value || 0} USDC`
            : TABS[tab.value].title === 'Deposit'
              ? 'Request deposit'
              : TABS[tab.value].title === 'Redeem'
                ? 'Request redemption'
                : 'Redeem instantly';

  return (
    <Card block>
      <FlexBlock direction="column" gap={16} block>
        <SwitchToggle
          active={tab}
          values={TABS}
          onSelect={t => {
            setTab(t);
            setValue('');
            tx.reset();
          }}
        />
        <InputComponent
          id="crosschain-amount"
          type="number"
          size="md"
          value={value}
          onChange={setValue}
          postfix={view.unit}
          formatWithCommas
          fullWidth
          placeholder="0.00"
        />
        <FlexBlock justifyContent="space-between" block>
          <Caption>{view.estimate}</Caption>
          <button
            className={styles.linkButton}
            onClick={() => setValue(fmtUnits(view.balance, 6).replace(/,/g, ''))}
          >
            Balance: {fmtUnits(view.balance)} {view.unit}
          </button>
        </FlexBlock>
        <Body level={2} className={styles.muted}>
          {view.note}
        </Body>
        {view.problem ? (
          <Body level={2} className={styles.error}>
            {view.problem}
          </Body>
        ) : null}
        <Button
          fullWidth
          size="lg"
          disabled={isConnected && (tx.isBusy || amount === BigInt(0) || !!view.problem)}
          onClick={() => (isConnected ? submit() : openConnectModal?.())}
        >
          {label}
        </Button>
        {tx.hash ? (
          <Caption>
            {tx.state === 'success' ? 'Confirmed' : tx.state === 'error' ? 'Failed' : 'Submitted'}:{' '}
            <a href={txUrl(tx.hash)} target="_blank" rel="noreferrer">
              {shortHash(tx.hash)}
            </a>
          </Caption>
        ) : null}
        {tx.error ? <Caption className={styles.error}>{tx.error}</Caption> : null}
      </FlexBlock>
    </Card>
  );
};
