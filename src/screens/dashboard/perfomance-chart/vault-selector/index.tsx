import { useState, useRef, useEffect } from 'react';
import { Card } from '@/shared/ui/card';
import { vaults } from '@/shared/blockchain/config';

import styles from './vault-selector.module.scss';
import { TVault } from '@/shared/blockchain/core/types';

export const VaultSelector = ({
  activeVault,
  onVaultSelect,
}: {
  activeVault: TVault;
  onVaultSelect: (vault: TVault) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedVault = activeVault;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleVaultSelect = (vault: TVault) => {
    onVaultSelect(vault);
    setIsOpen(false);
  };

  return (
    <div className={styles.vaultSelectorContainer} ref={dropdownRef}>
      <Card
        className={`${styles.vaultSelector} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.selectedVault}>
          <span className={styles.vaultName}>{selectedVault.coinName || 'Выберите vault'}</span>
          <span className={styles.chainName}>{selectedVault.chainName}</span>
        </div>
        <svg
          className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Card>

      {isOpen && (
        <div className={styles.dropdown}>
          {vaults.map(vault => (
            <div
              key={`${vault.chainID}-${vault.coinName}`}
              className={`${styles.dropdownItem} ${activeVault.coinName === vault.coinName && activeVault.chainID === vault.chainID ? styles.active : ''}`}
              onClick={() => handleVaultSelect(vault)}
            >
              <div className={styles.vaultInfo}>
                <span className={styles.vaultName}>{vault.coinName}</span>
                <span className={styles.chainName}>{vault.chainName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
