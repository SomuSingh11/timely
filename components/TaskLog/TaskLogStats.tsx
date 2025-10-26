import { formatTime } from "@/utils/timeFormat";
import { Clock, PlayCircle } from "lucide-react";

interface TaskLogStatsProps {
  totalTime: number;
  sessionCount: number;
}

export function TaskLogStats({ totalTime, sessionCount }: TaskLogStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <Clock size={16} />
          <span className="text-xs font-medium">Total Time</span>
        </div>
        <p className="text-2xl font-bold text-blue-900">
          {formatTime(totalTime)}
        </p>
      </div>

      <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
        <div className="flex items-center gap-2 text-purple-600 mb-1">
          <PlayCircle size={16} />
          <span className="text-xs font-medium">Sessions</span>
        </div>
        <p className="text-2xl font-bold text-purple-900">{sessionCount}</p>
      </div>
    </div>
  );
}
