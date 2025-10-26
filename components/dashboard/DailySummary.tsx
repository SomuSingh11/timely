"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  BarChart3,
  CheckCircle2,
  PlayCircle,
  Calendar,
} from "lucide-react";
import { formatDuration } from "@/utils/timeFormat";
import { getStatusColor } from "@/utils/statusColors";
import StatCard from "./StatCard";
import { AIInsights } from "./AIInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SummaryData {
  date: string;
  summary: {
    totalTimeTracked: number;
    tasksWorkedOn: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
  };
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    totalTime: number;
    sessions: number;
  }>;
  timeLogs: Array<{
    id: string;
    taskId: string;
    taskTitle: string;
    startTime: string;
    endTime: string | null;
    duration: number | null;
  }>;
}

export function DailySummary() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeTab, setActiveTab] = useState("activity");

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/summary/daily?date=${selectedDate}`);
        if (response.ok) {
          const data = await response.json();
          setSummary(data);
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [selectedDate]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-12 text-gray-500">
        Failed to load summary
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 h-full w-full">
      {/* Left Column */}
      <div className="space-y-4 pl-8 overflow-y-auto">
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
          <label
            htmlFor="date"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            📅 Select Date:
          </label>

          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-44 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 cursor-pointer"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Clock className="text-blue-600" size={24} />}
            label="Total Time"
            value={formatDuration(summary.summary.totalTimeTracked)}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<BarChart3 className="text-purple-600" size={24} />}
            label="Tasks Worked"
            value={summary.summary.tasksWorkedOn.toString()}
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={<CheckCircle2 className="text-green-600" size={24} />}
            label="Completed"
            value={summary.summary.completedTasks.toString()}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<PlayCircle className="text-orange-600" size={24} />}
            label="In Progress"
            value={summary.summary.inProgressTasks.toString()}
            bgColor="bg-orange-50"
          />
        </div>

        {/* Tasks Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tasks Breakdown
          </h2>
          {summary.tasks.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No tasks worked on this day
            </p>
          ) : (
            <div className="space-y-3">
              {summary.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {task.sessions} session{task.sessions !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatDuration(task.totalTime)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Right Column */}
      <div className="flex flex-col h-full min-h-0 pr-8">
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col h-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4 shrink-0">
            <TabsTrigger className="hover:cursor-pointer p-1" value="insights">
              ✨ AI Insights
            </TabsTrigger>
            <TabsTrigger className="hover:cursor-pointer p-1" value="activity">
              📜 Activity Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="flex-1 min-h-0 mt-0">
            <AIInsights date={selectedDate} />
          </TabsContent>

          {/* Activity Log Tab Content */}
          <TabsContent value="activity" className="flex-1 min-h-0 mt-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              {" "}
              {/* Added shadow */}
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Activity Log for {selectedDate}
              </h2>
              {summary.timeLogs.length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                  No time logs recorded for this day.
                </p>
              ) : (
                <div className="space-y-2 overflow-y-auto pr-2">
                  {summary.timeLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex items-center justify-between p-3 border-l-4 rounded-r-md transition-colors ${
                        log.endTime
                          ? "border-blue-500 bg-blue-50/50 hover:bg-blue-100/50"
                          : "border-green-500 bg-green-50/50 hover:bg-green-100/50 animate-pulse" // Style for running timer
                      }`}
                    >
                      {/* Left Side: Task Title & Time Range */}
                      <div className="flex-1 overflow-hidden mr-4">
                        {" "}
                        {/* Added overflow hidden */}
                        <h3
                          className="font-medium text-gray-900 text-sm truncate"
                          title={log.taskTitle}
                        >
                          {log.taskTitle}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {new Date(log.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {log.endTime
                            ? new Date(log.endTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Now"}
                        </p>
                      </div>
                      {/* Right Side: Duration or Running Indicator */}
                      <div className="text-right shrink-0">
                        <span className="text-sm font-semibold text-gray-900">
                          {log.duration
                            ? formatDuration(log.duration)
                            : log.endTime === null
                            ? formatDuration(
                                Math.floor(
                                  (Date.now() -
                                    new Date(log.startTime).getTime()) /
                                    1000
                                )
                              )
                            : "Calculating..."}
                        </span>
                        {!log.endTime && (
                          <span className="block text-xs text-green-600 font-medium mt-1">
                            ⏱️ Running
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
