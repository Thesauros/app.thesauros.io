import { useAccount } from '@/shared/blockchain/useAccount';
import { useUserPointsInfo } from '@/shared/api/pointProgram';

export const useUserPointProgramInfo = () => {
  const { address, isConnected } = useAccount();
  const { userPointsInfo } = useUserPointsInfo(address);

  return [
    {
      title: 'Your Points Balance',
      tooltipText:
        'Shows the total points you have earned in the program from all eligible activities.',
      value: isConnected && userPointsInfo ? userPointsInfo.totalBalance : '-',
    },
    {
      title: 'Leaderboard Rank',
      tooltipText:
        'Your current position among all participants. Top users may be eligible for end-of-season rewards; exact terms and rewards are subject to change and will be announced separately.',
      value: isConnected && userPointsInfo ? `#${userPointsInfo.rank}` : '-',
    },
  ];
};
