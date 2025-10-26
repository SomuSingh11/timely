"use client";

import React, { useState } from "react";
import { Task } from "@/types";
import { getStatusColor } from "@/utils/statusColors";
import { formatTime } from "@/utils/timeFormat";
import { Clock, Play, Square, Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: Task;
  isTimerActive: boolean;
  isAnyTimerActive: boolean;
  onStartTimer: (taskId: string) => void;
  onStopTimer: () => void;
  onTaskUpdate: (taskId: string, data: Partial<Task>) => Promise<void>;
  onDelete: (taskId: string) => void;
}

export function TaskCard({
  task,
  isTimerActive,
  isAnyTimerActive,
  onStartTimer,
  onStopTimer,
  onTaskUpdate,
  onDelete,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditTitle(task.title);
      setEditDescription(task.description || "");
    }
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      alert("Title cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onTaskUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false); // Exit edit mode on success
    } catch (error) {
      console.error("Failed to save edit:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: string) => {
    onTaskUpdate(task.id, { status: newStatus as Task["status"] });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id);
    }
  };

  return (
    <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-all h-full">
      {/* Task Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          {isEditing ? (
            // --- Editing View ---
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-lg font-semibold px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                disabled={isSubmitting}
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                disabled={isSubmitting}
              />
              {/* Save/Cancel buttons for edit mode */}
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={isSubmitting || !editTitle.trim()}
                >
                  <Check size={14} className="mr-1" />{" "}
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  <X size={14} className="mr-1" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            // --- Display View ---
            <>
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {task.title}
                </h3>

                {/* Description */}
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3 leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col justify-start gap-2 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEditToggle}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 h-8 w-8"
                  title="Edit Task"
                >
                  <Edit2 size={16} />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 h-8 w-8"
                  title="Delete Task"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="flex justify-between items-center gap-2 pt-3 border-t border-gray-100">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-sm px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="PENDING">📋 Pending</option>
            <option value="IN_PROGRESS">⚡ In Progress</option>
            <option value="COMPLETED">✅ Completed</option>
          </select>

          {isTimerActive ? (
            <Button
              onClick={onStopTimer}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2 px-4 py-2"
            >
              <Square size={14} fill="currentColor" />
              Stop Timer
            </Button>
          ) : (
            <Button
              onClick={() => onStartTimer(task.id)}
              disabled={isAnyTimerActive}
              variant="default"
              size="sm"
              className="flex items-center gap-2 px-4 py-2 hover:cursor-pointer"
            >
              <Play size={14} fill="currentColor" />
              Start Timer
            </Button>
          )}

          {isAnyTimerActive && !isTimerActive && (
            <span className="text-xs text-amber-600 truncate bg-amber-50 px-3 py-1.5 rounded-full ml-auto">
              ⏱️ Another timer is active
            </span>
          )}
        </div>
      )}
    </div>
  );
}
