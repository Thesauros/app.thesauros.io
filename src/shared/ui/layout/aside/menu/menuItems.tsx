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
  },
  {
    id: 'statistics',
    name: 'Statistics',
    path: '/statistics',
    icon: <PieChartIcon />,
  },
  {
    id: 'deposits',
    name: 'Deposits',
    path: '/deposits',
    icon: <LineChartUpIcon />,
  },
  {
    id: 'points-program',
    name: 'Points Program',
    path: '/points-program',
    icon: <CoinStackedIcon />,
  },
  {
    id: 'settings',
    name: 'Settings',
    path: '/settings',
    icon: <GearIcon />,
  },
];
