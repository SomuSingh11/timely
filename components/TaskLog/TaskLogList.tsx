import { TimeLog } from "@/types";
import { TaskLogItem } from "./TaskLogItem";

interface TaskLogListProps {
  logs: TimeLog[];
  activeTimer: TimeLog | null;
  elapsedTime: number;
}

export function TaskLogList({
  logs,
  activeTimer,
  elapsedTime,
}: TaskLogListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Activity Log
      </h3>

      <div className="space-y-2  overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {logs.map((log, index) => (
          <TaskLogItem
            key={log.id}
            log={log}
            sessionNumber={logs.length - index}
            activeTimer={activeTimer}
            elapsedTime={elapsedTime}
          />
        ))}
      </div>
    </div>
  );
}
