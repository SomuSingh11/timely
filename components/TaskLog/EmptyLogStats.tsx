import { Clock } from "lucide-react";

export function EmptyLogState() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Activity Log
      </h3>
      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <Clock size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">No time logs yet for this task</p>
        <p className="text-xs text-gray-400 mt-1">
          Start the timer to begin tracking
        </p>
      </div>
    </div>
  );
}
