import { Button } from '@/shared/ui/button';
import { useModal } from '@/shared/ui/modal/useModal';
import { GenerateLinkModal } from './generate-link-modal';
import { useAccount } from '@/shared/blockchain/useAccount';
import { useUserPointsInfo } from '@/shared/api/pointProgram';

export const useUserPointProgramInfo = () => {
  const { address, isConnected } = useAccount();
  const { userPointsInfo } = useUserPointsInfo(address);

  return [
    {
      title: 'Your Points Balance',
      value: isConnected && userPointsInfo ? userPointsInfo.totalBalance : '-',
      additionalInfo: '+127 earned today',
    },
    {
      title: 'Leaderboard Rank',
      value: isConnected && userPointsInfo ? `#${userPointsInfo.rank}` : '-',
      additionalInfo: 'Top 5% of users',
    },
    {
      title: 'Referral Earnings',
      value: isConnected && userPointsInfo ? userPointsInfo.referralEarnings : '-',
      additionalInfo: 'From 3 active friends',
    },
  ];
};

export const EarnedPoints = () => {
  const { open } = useModal();
  return [
    {
      title: 'Connect Wallet',
      description: 'Connect your Web3 wallet to get started',
      value: '+100PTS',
      isCompleted: true,
    },
    {
      title: 'First Deposit $100+',
      description: 'Make your first deposit of at least $100',
      value: '+500PTS',
      isCompleted: true,
    },
    {
      title: 'Maintain TVL 30+ days',
      description: 'Keep your funds deposited for 30 consecutive days',
      value: '+2000PTS',
      isCompleted: false,
      progressBar: {
        current: 12,
        total: 30,
        postfix: 'Days',
      },
    },
    {
      title: 'Invite Friends',
      description: 'Earn 5% of your friend`s daily points forever',
      value: '+2000PTS',
      isCompleted: false,
      action: (
        <Button size="xxs" onClick={() => open(<GenerateLinkModal />)}>
          Generate Link
        </Button>
      ),
    },
    {
      title: 'Hold $1000+ TVL',
      description: 'Deposit and maintain at least $1000 for bonus rewards',
      value: '+1.5xMULT',
      isCompleted: false,
      progressBar: {
        current: 287,
        total: 1000,
        prefix: '$',
      },
    },
  ];
};
