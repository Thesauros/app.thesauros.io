export interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
    dataKey: string;
    payload: {
      revenue?: number;
      engagement?: number;
      profit?: number;
      sessions?: number;
    };
  }[];
  label?: string;
}
