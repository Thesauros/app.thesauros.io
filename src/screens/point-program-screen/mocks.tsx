import { useAccount } from '@/shared/blockchain/useAccount';
import { useUserPointsInfo } from '@/shared/api/pointProgram';

export const useUserPointProgramInfo = () => {
  const { address, isConnected } = useAccount();
  const { userPointsInfo } = useUserPointsInfo(address);

  return [
    {
      title: 'Your Points Balance',
      value: isConnected && userPointsInfo ? userPointsInfo.totalBalance : '-',
    },
    {
      title: 'Leaderboard Rank',
      value: isConnected && userPointsInfo ? `#${userPointsInfo.rank}` : '-',
    },
  ];
};
