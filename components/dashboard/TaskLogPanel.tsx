"use client";

import { Task, TimeLog } from "@/types";
import { Clock } from "lucide-react";
import { TaskLogHeader } from "../TaskLog/TaskLogHeader";
import { TaskLogStats } from "../TaskLog/TaskLogStats";
import { EmptyLogState } from "../TaskLog/EmptyLogStats";
import { TaskLogList } from "../TaskLog/TaskLogList";

interface TaskLogPanelProps {
  selectedTask: Task | null;
  taskLogs: TimeLog[];
  loadingLogs: boolean;
  activeTimer: TimeLog | null;
  elapsedTime: number;
}

export function TaskLogPanel({
  selectedTask,
  taskLogs,
  loadingLogs,
  activeTimer,
  elapsedTime,
}: TaskLogPanelProps) {
  const totalLoggedTime = taskLogs.reduce(
    (sum, log) => sum + (log.duration || 0),
    0
  );

  if (!selectedTask) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:sticky lg:top-4 h-fit">
        <div className="text-center py-12">
          <Clock size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Select a task to view time logs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:sticky lg:top-4 h-full overflow-hidden flex flex-col">
      <TaskLogHeader
        taskTitle={selectedTask.title}
        taskDescription={selectedTask.description}
      />

      <TaskLogStats
        totalTime={totalLoggedTime}
        sessionCount={taskLogs.length}
      />

      {loadingLogs ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading logs...</p>
        </div>
      ) : taskLogs.length === 0 ? (
        <EmptyLogState />
      ) : (
        <TaskLogList
          logs={taskLogs}
          activeTimer={activeTimer}
          elapsedTime={elapsedTime}
        />
      )}
    </div>
  );
}
