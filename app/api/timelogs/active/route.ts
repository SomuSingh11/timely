import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/nextauth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getAuthSession();

    // 1. Authorization Check
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const activeLog = await prisma.timeLog.findFirst({
      where: {
        userId: userId,
        endTime: null,
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

    return NextResponse.json(activeLog);
  } catch (error) {
    console.error("Error fetching active time log:", error);
    return NextResponse.json(
      { error: "Failed to fetch active time log" },
      { status: 500 }
    );
  }
}
