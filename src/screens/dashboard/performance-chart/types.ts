export interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
    dataKey: string;
    payload: {
      date: string;
      marketValue: number;
    };
  }[];
  label?: string;
}
