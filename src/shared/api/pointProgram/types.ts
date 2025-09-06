export type TTaskRaw = {
  id: string;
  title: string;
  points: number;
  description: number;
  isCompleted: boolean;
  progress: {
    total: number;
    current: number;
    prefix: string;
    postfix: string;
  };
};
