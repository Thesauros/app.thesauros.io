import React from 'react';
import { Card } from '@/shared/ui/card';
import { InfoIcon } from '@/shared/ui/icons';
import { mockTransactions } from './mocks';
import styles from './transaction-table.module.scss';

export const TransactionTable = () => {
  const formatAmount = (amount: number) => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}${amount.toFixed(3)}`;
  };

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? styles.positive : styles.negative;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Successfully') {
      return <div className={styles.statusDot} />;
    }
    return null;
  };

  return (
    <Card className={styles.transactionTable}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Transactions</h3>
        <InfoIcon />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Coin</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Data & Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.coin}</td>
                <td>{transaction.type}</td>
                <td className={getAmountColor(transaction.amount)}>
                  {formatAmount(transaction.amount)}
                </td>
                <td>
                  <div className={styles.status}>
                    {getStatusIcon(transaction.status)}
                    <span>{transaction.status}</span>
                  </div>
                </td>
                <td>{transaction.dateTime}</td>
                <td>
                  <button className={styles.actionButton}>Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
