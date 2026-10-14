import { useEffect, useRef, useState } from 'react';
import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Body } from '@/shared/ui/new-typography/body';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import type { TCrossChainActivity } from '@/shared/api/crosschain';
import { explorerTx } from '@/shared/blockchain/crosschain/config';
import { toFeed, type TTone } from '../model/activity';
import { fmtAgo } from '../model/money';
import styles from '../crosschain.module.scss';

/** Small tintable glyphs, drawn here because the shared icon kit carries fixed colours. */
const Glyph = ({ tone }: { tone: TTone }) => {
  const common = {
    width: 14,
    height: 14,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (tone) {
    case 'deposit':
      return (
        <svg {...common}>
          <path d="M8 2.5v9M8 11.5 4.5 8M8 11.5 11.5 8M3 13.5h10" />
        </svg>
      );
    case 'withdraw':
      return (
        <svg {...common}>
          <path d="M8 13.5v-9M8 4.5 4.5 8M8 4.5 11.5 8M3 2.5h10" />
        </svg>
      );
    case 'bridge':
      return (
        <svg {...common}>
          <path d="M2.5 6h11M10.5 3l3 3-3 3M13.5 10h-11M5.5 7l-3 3 3 3" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M2.5 11.5 6 8l2.5 2.5L13.5 5M13.5 5H10M13.5 5v3.5" />
        </svg>
      );
  }
};

type TProps = {
  activity?: TCrossChainActivity[];
  isLoading: boolean;
  assetSymbol: string;
  shareSymbol: string;
  /** Chain clock, so the relative times agree with the chain rather than the visitor's machine. */
  now: number;
  /** When the feed last changed, to say how fresh the page is. */
  updatedAt: number;
};

export const ActivityFeed = ({
  activity,
  isLoading,
  assetSymbol,
  shareSymbol,
  now,
  updatedAt,
}: TProps) => {
  const items = toFeed(activity, assetSymbol, shareSymbol);

  // Only rows that appear after the first paint are marked as arriving, so the entrance
  // animation means "this just happened" and not "the page just rendered".
  const seen = useRef<Set<string> | null>(null);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  useEffect(() => {
    const keys = items.map(i => i.key);
    if (seen.current === null) {
      seen.current = new Set(keys);
      return;
    }
    const arrived = keys.filter(k => !seen.current!.has(k));
    keys.forEach(k => seen.current!.add(k));
    if (arrived.length > 0) setFresh(new Set(arrived));
  }, [items]);

  const wallNow = Math.floor(Date.now() / 1000);

  return (
    <Card block>
      <FlexBlock direction="column" gap={14} block>
        <FlexBlock justifyContent="space-between" alignItems="center" block>
          <FlexBlock gap={8} alignItems="center">
            <Subtitle level={1} weight="bold">
              Live activity
            </Subtitle>
            <span className={styles.liveDot} aria-hidden />
          </FlexBlock>
          <Tooltip tooltipText="Read from the blockchain every 15 seconds. Everything here is a transaction anyone can verify.">
            <Caption className={styles.muted}>
              {updatedAt > 0 ? `updated ${fmtAgo(wallNow - updatedAt)}` : 'connecting…'}
            </Caption>
          </Tooltip>
        </FlexBlock>

        {isLoading ? (
          <Caption className={styles.muted}>Reading the blockchain…</Caption>
        ) : items.length === 0 ? (
          <Caption className={styles.muted}>
            Nothing has happened yet. Deposits, withdrawals, price updates and network transfers
            appear here as they land.
          </Caption>
        ) : (
          <div className={styles.feed}>
            {items.slice(0, 12).map(item => (
              <div
                key={item.key}
                className={`${styles.feedItem} ${fresh.has(item.key) ? styles.feedFresh : ''}`}
              >
                <span className={`${styles.feedIcon} ${styles[`tone_${item.tone}`]}`}>
                  <Glyph tone={item.tone} />
                </span>
                <FlexBlock direction="column" gap={2} className={styles.feedBody}>
                  <Body level={2} weight="medium">
                    {item.title}
                  </Body>
                  <Caption className={styles.muted}>{item.detail}</Caption>
                </FlexBlock>
                <FlexBlock
                  direction="column"
                  gap={2}
                  alignItems="flex-end"
                  className={styles.feedSide}
                >
                  <Caption className={styles.muted}>{fmtAgo(now - item.time)}</Caption>
                  {item.tx ? (
                    <a
                      className={styles.feedTx}
                      href={explorerTx(item.chainId ?? 8453, item.tx)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      proof
                    </a>
                  ) : null}
                </FlexBlock>
              </div>
            ))}
          </div>
        )}
      </FlexBlock>
    </Card>
  );
};
