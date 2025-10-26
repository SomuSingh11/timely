"use client";

import React, { useEffect, useState } from "react";
import { Task, TimeLog } from "@/types";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { TaskCard } from "./TaskCard";
import { TaskLogPanel } from "./TaskLogPanel";

interface TaskListProps {
  tasks: Task[];
  activeTimer: TimeLog | null;
  elapsedTime: number;
  onStartTimer: (taskId: string) => Promise<void>;
  onStopTimer: () => Promise<void>;
  onTaskUpdated: () => Promise<void>;
  onTaskDeleted: () => Promise<void>;
}

function TaskList({
  tasks,
  activeTimer,
  elapsedTime,
  onStartTimer,
  onStopTimer,
  onTaskUpdated,
  onTaskDeleted,
}: TaskListProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskLogs, setTaskLogs] = useState<TimeLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    if (tasks.length > 0 && selectedTaskId === null) {
      setSelectedTaskId(tasks[0].id);
    }
  }, [tasks, selectedTaskId]);

  useEffect(() => {
    if (selectedTaskId && !tasks.find((t) => t.id === selectedTaskId)) {
      const newSelection = tasks.length > 0 ? tasks[0].id : null;
      setSelectedTaskId(newSelection);
    }
  }, [tasks, selectedTaskId]);

  useEffect(() => {
    if (selectedTaskId) {
      fetchTaskLogs(selectedTaskId);
    } else {
      setTaskLogs([]);
    }
  }, [selectedTaskId]);

  const fetchTaskLogs = async (taskId: string) => {
    setLoadingLogs(true);
    try {
      const response = await fetch(`/api/timelogs?taskId=${taskId}`);
      if (response.ok) {
        const logs = await response.json();
        setTaskLogs(logs);
      }
    } catch (error) {
      console.error("Error fetching task logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleTaskUpdate = async (taskId: string, data: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await onTaskUpdated();
      }
    } catch (error) {
      console.error("Error during task update:", error);
      alert("Error occurred. Could not update task.");
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await onTaskDeleted();
      }
    } catch (error) {
      console.error("Error during task deletion:", error);
      alert("Error occurred. Could not delete task.");
    }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="px-4 py-4 pl-8">
        <CreateTaskDialog onTaskCreated={onTaskUpdated} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 grow overflow-hidden px-4 pb-4">
        {/* Tasks Column - FIX THIS PART */}
        <div className="h-full overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-min pb-4 p-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                className={`cursor-pointer transition-all ${
                  selectedTaskId === task.id
                    ? "ring-2 ring-gray-800/15 ring-offset-0 rounded-lg"
                    : "hover:shadow-lg"
                }`}
              >
                <TaskCard
                  task={task}
                  isTimerActive={activeTimer?.taskId === task.id}
                  isAnyTimerActive={!!activeTimer}
                  onStartTimer={onStartTimer}
                  onStopTimer={onStopTimer}
                  onTaskUpdate={handleTaskUpdate}
                  onDelete={handleTaskDelete}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Logs Column */}
        <div className="h-full overflow-hidden mt-4">
          <TaskLogPanel
            selectedTask={selectedTask || null}
            taskLogs={taskLogs}
            loadingLogs={loadingLogs}
            activeTimer={activeTimer}
            elapsedTime={elapsedTime}
          />
        </div>
      </div>
    </div>
  );
}

export default TaskList;
