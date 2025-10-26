"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Status } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface CreateTaskDialogProps {
  onTaskCreated: () => Promise<void>;
}

export function CreateTaskDialog({ onTaskCreated }: CreateTaskDialogProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<Status>(Status.PENDING);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!newTaskTitle.trim() || !newTaskDescription.trim()) {
      alert("Title and description are required");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        status: newTaskStatus,
      }),
    });

    if (res.ok) {
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskStatus(Status.PENDING);
      setIsDialogOpen(false);
      await onTaskCreated();
    } else {
      console.error("Failed to create task");
      alert("Failed to create task. Check console for details.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 hover:cursor-pointer">
          <Plus size={16} />
          New Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <Card className="border-none shadow-none -mt-4">
          <form onSubmit={createTask}>
            <CardHeader className="p-0 pb-4">
              <p className="text-sm text-muted-foreground">
                Enter details for your new task.
              </p>
            </CardHeader>

            <CardContent className="p-0 grid gap-4">
              {/* Title Input (Standard HTML) */}
              <div className="grid gap-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Follow up with designer"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                  required
                />
              </div>

              {/* Description Textarea (Standard HTML) */}
              <div className="grid gap-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Send a slack message to confirm status."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                />
              </div>

              {/* Status Select (Standard HTML) */}
              <div className="grid gap-2">
                <label
                  htmlFor="status"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={newTaskStatus}
                  onChange={(e) => setNewTaskStatus(e.target.value as Status)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                >
                  <option value={Status.PENDING}>Pending</option>
                  <option value={Status.IN_PROGRESS}>In Progress</option>
                  <option value={Status.COMPLETED}>Completed</option>
                </select>
              </div>
            </CardContent>

            <CardFooter className="p-0 pt-6">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating task..." : "Create Task"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
