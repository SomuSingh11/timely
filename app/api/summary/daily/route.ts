import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";

export async function GET(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    // Get start and end of day
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const timeLogs = await prisma.timeLog.findMany({
      where: {
        userId: session.user.id,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    // Get unique task IDs
    const taskIds = [...new Set(timeLogs.map((log) => log.taskId))];

    // Get task details
    const tasks = await prisma.task.findMany({
      where: {
        id: { in: taskIds },
        userId: session.user.id,
      },
      include: {
        timeLogs: {
          where: {
            startTime: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        },
      },
    });

    // Calculate statistics
    const totalTimeTracked = timeLogs.reduce(
      (sum, log) => sum + (log.duration || 0),
      0
    );

    const tasksWorkedOn = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "IN_PROGRESS"
    ).length;
    const pendingTasks = tasks.filter((t) => t.status === "PENDING").length;

    // Group time by task
    const taskSummaries = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      totalTime: task.timeLogs.reduce(
        (sum, log) => sum + (log.duration || 0),
        0
      ),
      sessions: task.timeLogs.length,
    }));

    return NextResponse.json({
      date: startOfDay.toISOString(),
      summary: {
        totalTimeTracked,
        tasksWorkedOn,
        completedTasks,
        inProgressTasks,
        pendingTasks,
      },
      tasks: taskSummaries,
      timeLogs: timeLogs.map((log) => ({
        id: log.id,
        taskId: log.taskId,
        taskTitle: log.task.title,
        startTime: log.startTime.toISOString(),
        endTime: log.endTime?.toISOString() || null,
        duration: log.duration,
      })),
    });
  } catch (error) {
    console.error("Error fetching daily summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily summary" },
      { status: 500 }
    );
  }
}
