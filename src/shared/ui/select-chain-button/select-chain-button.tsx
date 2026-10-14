import styles from './select-chain-button.module.scss';
import { useState, useRef } from 'react';
import { base, arbitrum, mainnet, plasma, monad } from 'wagmi/chains';
import { useClickOutside } from '@/shared/browser/useClickOutside';
import { useViewChain } from '@/shared/blockchain';

const ALLOWED_CHAINS = [base, arbitrum, mainnet, plasma, monad];

export const SelectChainButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { viewChainId, setViewChainId } = useViewChain();

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const currentChain = ALLOWED_CHAINS.find(c => c.id === viewChainId);

  // Only the chain being viewed changes here. The wallet is asked to switch
  // right before signing instead, so picking a network never bounces mobile
  // users out into their wallet app.
  const handleChainSelect = (chain: (typeof ALLOWED_CHAINS)[number]) => {
    setViewChainId(chain.id);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={dropdownRef} data-testid="network-selector">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={styles.buttonContainer}
        data-testid="network-button"
      >
        {currentChain ? (
          <img
            alt={currentChain.name}
            src={getChainIcon(currentChain.id)}
            style={{ width: 24, height: 24, borderRadius: '50%' }}
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
            <g fill="none" stroke="#196bff">
              <path d="M9.15 7.831a2.976 2.976 0 1 1 5.701 0l-1.564 5.211c-.07.234-.105.351-.159.447a1 1 0 0 1-.654.487C12.366 14 12.244 14 12 14c-.244 0-.366 0-.474-.024a1 1 0 0 1-.654-.487c-.054-.096-.09-.213-.16-.447z" />
              <circle cx="12" cy="19" r="2" />
            </g>
          </svg>
        )}
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {ALLOWED_CHAINS.map(chain => (
            <div
              key={chain.id}
              className={`${styles.chainOption} ${chain.id === viewChainId ? styles.active : ''}`}
              onClick={() => handleChainSelect(chain)}
              data-testid={`network-option-dd-${chain.id}`}
            >
              <img
                alt={chain.name}
                src={getChainIcon(chain.id)}
                style={{ width: 20, height: 20, borderRadius: '50%' }}
              />
              <span>{chain.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function getChainIcon(chainId: number): string {
  const icons: Record<number, string> = {
    [base.id]: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
    [arbitrum.id]: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg',
    [mainnet.id]: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
    [plasma.id]: 'https://icons.llamao.fi/icons/chains/rsz_plasma.jpg',
    [monad.id]: 'https://icons.llamao.fi/icons/chains/rsz_monad.jpg',
  };
  return icons[chainId] ?? '';
}
