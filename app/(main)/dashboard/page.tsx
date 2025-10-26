"use client";

import { CreateTaskDialog } from "@/components/dashboard/CreateTaskDialog";
import { DailySummary } from "@/components/dashboard/DailySummary";
import TaskList from "@/components/dashboard/TaskList";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";
import { BarChart3, LayoutGrid } from "lucide-react";
import React, { useState } from "react";

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
  const [view, setView] = useState<"tasks" | "summary">("tasks");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full w-full flex flex-col">
      {/* View Toggle */}
      <div className="flex gap-2 mb-6 pl-8">
        <CreateTaskDialog onTaskCreated={onTaskUpdated} />
        <Button
          variant={view === "tasks" ? "default" : "outline"}
          onClick={() => setView("tasks")}
          className="flex items-center gap-2"
        >
          <LayoutGrid size={16} />
          Tasks
        </Button>
        <Button
          variant={view === "summary" ? "default" : "outline"}
          onClick={() => setView("summary")}
          className="flex items-center gap-2"
        >
          <BarChart3 size={16} />
          Summary
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === "tasks" ? (
          <TaskList
            tasks={tasks}
            activeTimer={activeTimer}
            elapsedTime={elapsedTime}
            onStartTimer={startTimer}
            onStopTimer={stopTimer}
            onTaskUpdated={onTaskUpdated}
            onTaskDeleted={onTaskDeleted}
          />
        ) : (
          <div className="h-full overflow-y-auto">
            <DailySummary />
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
