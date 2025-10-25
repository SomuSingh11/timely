import prisma from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { NextRequest, NextResponse } from "next/server";

// Get all tasks for the authenticated user
export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        timeLogs: {
          select: {
            duration: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const tasksWithTotalTime = tasks.map((task) => {
      const totalTime = task.timeLogs.reduce(
        (acc, log) => acc + (log.duration || 0),
        0
      );

      return { ...task, totalTime };
    });

    return NextResponse.json(tasksWithTotalTime, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Create a new task
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, status } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || "Pending",
        userId: session.user.id,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
