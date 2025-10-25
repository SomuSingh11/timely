"use client";

import React from "react";
import { Task } from "@/types";
import { CreateTaskDialog } from "./CreateTaskDialog";

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: () => Promise<void>;
  onTaskDeleted: () => Promise<void>;
}
function TaskList({ tasks, onTaskUpdated, onTaskDeleted }: TaskListProps) {
  return (
    <div>
      <CreateTaskDialog onTaskCreated={onTaskUpdated} />
    </div>
  );
}

export default TaskList;
