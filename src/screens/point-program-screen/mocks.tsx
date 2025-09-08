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
