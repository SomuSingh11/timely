"use client"; // Retain if necessary for parent components

interface TaskLogHeaderProps {
  taskTitle: string | undefined | null;
  taskDescription?: string | undefined | null;
}

export function TaskLogHeader({
  taskTitle,
  taskDescription,
}: TaskLogHeaderProps) {
  return (
    <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
      {taskTitle ? (
        <div className="space-y-2">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Selected Task
            </span>
            <p
              className="text-md font-medium text-gray-900 leading-tight mt-0.5 truncate"
              title={taskTitle}
            >
              {taskTitle}
            </p>
          </div>
          {taskDescription && (
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </span>
              <p
                className="text-sm text-gray-600 leading-normal mt-0.5 line-clamp-2"
                title={taskDescription}
              >
                {taskDescription}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          No task selected to view logs.
        </p>
      )}
    </div>
  );
}
