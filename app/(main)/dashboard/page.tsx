"use client";

import TaskList from "@/components/dashboard/TaskList";
import { Task } from "@/types";
import React from "react";

function Page() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.log("Error fetching Tasks: ", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTasks();
  }, []);
  return (
    <div className="p-6">
      <TaskList
        tasks={tasks}
        onTaskUpdated={fetchTasks}
        onTaskDeleted={fetchTasks}
      />
    </div>
  );
}

export default Page;
