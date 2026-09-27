import { isCrossChainEnabled } from '@/shared/blockchain/crosschain/config';
import {
  CoinStackedIcon,
  GearIcon,
  GridIcon,
  LineChartUpIcon,
  PieChartIcon,
} from '@/shared/ui/icons';

export const MENU_ITEMS = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/',
    icon: <GridIcon />,
    disabled: false,
  },
  {
    id: 'statistics',
    name: 'Statistics',
    path: '/statistics',
    icon: <PieChartIcon />,
    disabled: true,
  },
  {
    id: 'deposits',
    name: 'Deposits',
    path: '/deposits',
    icon: <LineChartUpIcon />,
    disabled: true,
  },
  {
    id: 'crosschain',
    name: 'Cross-chain Vault',
    path: '/crosschain',
    icon: <LineChartUpIcon />,
    disabled: !isCrossChainEnabled(),
  },
  {
    id: 'points-program',
    name: 'Points Program',
    path: '/point-program',
    icon: <CoinStackedIcon />,
    disabled: false,
  },
  {
    id: 'settings',
    name: 'Settings',
    path: '/settings',
    icon: <GearIcon />,
    disabled: true,
  },
];
