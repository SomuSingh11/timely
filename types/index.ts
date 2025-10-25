export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeLog {
  id: string;
  taskId: string;
  startTime: Date | null;
  endTime: Date | null;
  duration: number | null;
  task: {
    id: string;
    title: string;
  };
}
