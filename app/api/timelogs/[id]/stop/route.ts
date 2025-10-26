import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";

// STOP time tracking
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    const { id: paramsId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify time log belongs to user and is active
    const timeLog = await prisma.timeLog.findUnique({
      where: {
        id: paramsId,
        userId: session.user.id,
      },
    });

    if (!timeLog) {
      return NextResponse.json(
        { error: "Time log not found" },
        { status: 404 }
      );
    }

    if (timeLog.endTime) {
      return NextResponse.json(
        { error: "Time log already stopped" },
        { status: 400 }
      );
    }

    const endTime = new Date();
    const duration = Math.floor(
      (endTime.getTime() - new Date(timeLog.startTime).getTime()) / 1000
    );

    // Update time log with end time and duration
    const updatedTimeLog = await prisma.timeLog.update({
      where: {
        id: paramsId,
      },
      data: {
        endTime,
        duration,
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

    return NextResponse.json(updatedTimeLog);
  } catch (error) {
    console.error("Error stopping time log:", error);
    return NextResponse.json(
      { error: "Failed to stop time tracking" },
      { status: 500 }
    );
  }
}
