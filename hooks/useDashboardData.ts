import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Task, TimeLog } from "@/types";

interface DashboardData {
  tasks: Task[];
  activeTimer: TimeLog | null;
  elapsedTime: number;
  loading: boolean;
  fetchTasks: () => Promise<void>;
  fetchActiveTimer: () => Promise<void>;
  startTimer: (taskId: string) => Promise<void>;
  stopTimer: () => Promise<void>;
  onTaskUpdated: () => Promise<void>;
  onTaskDeleted: () => Promise<void>;
}

export function useDashboardData(): DashboardData {
  const { status } = useSession();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTimer, setActiveTimer] = useState<TimeLog | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching Handlers ---

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActiveTimer = useCallback(async () => {
    try {
      const response = await fetch("/api/time-logs/active");

      if (response.ok) {
        const activeLog: TimeLog | null = await response.json();

        if (activeLog) {
          setActiveTimer(activeLog);
          const start = new Date(activeLog.startTime!).getTime();
          setElapsedTime(Math.floor((Date.now() - start) / 1000));
        } else {
          setActiveTimer(null);
          setElapsedTime(0);
        }
      } else {
        console.error("Failed to fetch active timer status:", response.status);
        setActiveTimer(null);
        setElapsedTime(0);
      }
    } catch (error) {
      console.error("Error fetching active timer:", error);

      setActiveTimer(null);
      setElapsedTime(0);
    }
  }, []);

  // --- Timer Control Handlers ---

  const startTimer = useCallback(
    async (taskId: string) => {
      if (activeTimer) {
        alert("Please stop the current timer first");
        return;
      }

      try {
        const response = await fetch("/api/timelogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId }),
        });

        if (response.ok) {
          const log = await response.json();
          setActiveTimer(log);
          fetchTasks();
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Failed to start timer.");
        }
      } catch (error) {
        console.error("Error starting timer:", error);
      }
    },
    [activeTimer, fetchTasks]
  );

  const stopTimer = useCallback(async () => {
    if (!activeTimer) return;

    try {
      const response = await fetch(`/api/timelogs/${activeTimer.id}/stop`, {
        method: "PATCH",
      });

      if (response.ok) {
        setActiveTimer(null);
        setElapsedTime(0);
        fetchTasks();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to stop timer.");
      }
    } catch (error) {
      console.error("Error stopping timer:", error);
    }
  }, [activeTimer, fetchTasks]);

  // --- CRUD Update Callbacks (Pass fetchTasks to refresh view) ---
  const onTaskUpdated = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  const onTaskDeleted = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  // --- Effects ---

  // Effect 1: Authentication and Initial Data Load
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated") {
      fetchTasks();
      fetchActiveTimer();
    }
  }, [status, router, fetchTasks, fetchActiveTimer]);

  // Effect 2: Real-time Timer Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (activeTimer?.startTime) {
      interval = setInterval(() => {
        const startTimeValue = activeTimer.startTime;
        const startMs = new Date(startTimeValue!).getTime();
        const nowMs = Date.now();

        setElapsedTime(Math.floor((nowMs - startMs) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  return {
    tasks,
    activeTimer,
    elapsedTime,
    loading,
    fetchTasks,
    fetchActiveTimer,
    startTimer,
    stopTimer,
    onTaskUpdated,
    onTaskDeleted,
  };
}
