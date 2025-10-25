"use client";

import TaskList from "@/components/dashboard/TaskList";
import { useDashboardData } from "@/hooks/useDashboardData";
import React from "react";

function Page() {
  const {
    tasks,
    activeTimer,
    elapsedTime,
    loading,
    startTimer,
    stopTimer,
    onTaskUpdated,
    onTaskDeleted,
  } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full w-full">
      <TaskList
        tasks={tasks}
        activeTimer={activeTimer}
        elapsedTime={elapsedTime}
        onStartTimer={startTimer}
        onStopTimer={stopTimer}
        onTaskUpdated={onTaskUpdated}
        onTaskDeleted={onTaskDeleted}
      />
    </div>
  );
}

export default Page;
