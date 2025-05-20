export type CreateTaskParams = {
  logTrace: string;
  url: string;
  queue: string;
  payload: any;
  delayInSeconds?: number;
  httpMethod: string;
  headers?: Record<string, string>;
  attempts: number;
};

// Interface for task data that will be stored in Bull
export type TaskData = {
  logTrace: string;
  url: string;
  httpMethod: string;
  headers: Record<string, string>;
  payload: any;
};

// Task response interface
export type TaskResponse = {
  id: string | number;
  name: string;
  queue: string;
  timestamp: number;
  delay: number;
  attempts: number;
};

// Task status interface
export type TaskStatus = {
  id: string | number;
  state: string;
  attempts: number;
  data: TaskData;
  createdAt: Date;
  processedAt: Date | null;
  finishedAt: Date | null;
  result: any;
};
