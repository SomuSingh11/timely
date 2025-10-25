import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";

// GET all time logs for logged-in user
export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    const timeLogs = await prisma.timeLog.findMany({
      where: {
        userId: session.user.id,
        ...(taskId && { taskId }),
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return NextResponse.json(timeLogs);
  } catch (error) {
    console.error("Error fetching time logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch time logs" },
      { status: 500 }
    );
  }
}

// START time tracking
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        userId: session.user.id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const activeLog = await prisma.timeLog.findFirst({
      where: {
        userId: session.user.id,
        endTime: null,
      },
    });

    if (activeLog) {
      return NextResponse.json(
        { error: "Please stop the current timer before starting a new one" },
        { status: 400 }
      );
    }

    const timeLog = await prisma.timeLog.create({
      data: {
        taskId,
        userId: session.user.id,
        startTime: new Date(),
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    await prisma.task.update({
      where: { id: taskId },
      data: { status: "IN_PROGRESS" },
    });

    return NextResponse.json(timeLog, { status: 201 });
  } catch (error) {
    console.error("Error starting time log:", error);
    return NextResponse.json(
      { error: "Failed to start time tracking" },
      { status: 500 }
    );
  }
}
