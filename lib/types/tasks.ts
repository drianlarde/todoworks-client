export type Task = {
  id: string;
  task: string;
  description: string;
  completed: boolean;
  isPending?: boolean;
};
