import { TimeLog } from "@/types";
import { Calendar, Clock } from "lucide-react";

interface TaskLogItemProps {
  log: TimeLog;
  sessionNumber: number;
  activeTimer: TimeLog | null;
  elapsedTime: number;
}

export function TaskLogItem({
  log,
  sessionNumber,
  activeTimer,
  elapsedTime,
}: TaskLogItemProps) {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const formatDateTime = (dateInput?: string | Date | null) => {
    if (!dateInput) {
      return { date: "—", time: "—" };
    }
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const startDateTime = formatDateTime(log.startTime);
  const endDateTime = log.endTime ? formatDateTime(log.endTime) : null;
  const isActive = !log.endTime && activeTimer?.id === log.id;

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-500">
            Session #{sessionNumber}
          </span>
        </div>
        {log.duration && (
          <span className="text-sm font-bold text-gray-900">
            {formatDuration(log.duration)}
          </span>
        )}
        {!log.endTime && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            ⏱️ Active
          </span>
        )}
      </div>

      <div className="space-y-1 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={12} />
          <span>{startDateTime.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} />
          <span>
            {startDateTime.time} -{" "}
            {endDateTime ? endDateTime.time : "In progress"}
          </span>
        </div>
      </div>

      {isActive && (
        <div className="mt-3 pt-3 border-t border-gray-300">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Current duration:</span>
            <span className="text-sm font-mono font-bold text-blue-600">
              {formatTime(elapsedTime)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
