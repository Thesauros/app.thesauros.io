export interface Transaction {
  id: string;
  coin: string;
  type: 'Deposite' | 'Withdraw';
  amount: number;
  status: 'Successfully' | 'Pending' | 'Failed';
  dateTime: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    coin: 'USDT',
    type: 'Deposite',
    amount: 527.329,
    status: 'Successfully',
    dateTime: '2025-07-29 14:03',
  },
  {
    id: '2',
    coin: 'USDT',
    type: 'Withdraw',
    amount: -204.0,
    status: 'Successfully',
    dateTime: '2025-10-30 12:05',
  },
  {
    id: '3',
    coin: 'USDT',
    type: 'Deposite',
    amount: 177.529,
    status: 'Successfully',
    dateTime: '2025-12-28 18:03',
  },
];
