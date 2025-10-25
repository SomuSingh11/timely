import prisma from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type UpdateData = {
  title?: string;
  description?: string | null; // Allows string or null
  status?: Status; // Use the Prisma enum type
};

// Get a specific task by ID for the authenticated user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        timeLogs: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete a specific task by ID for the authenticated user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deletedTask = await prisma.task.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!deletedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update a specific task by ID for the authenticated user
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, status } = body;

    const existingTask = await prisma.task.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updatedData: UpdateData = {};

    if (title) updatedData.title = title.trim();
    if (description !== undefined)
      updatedData.description = description?.trim() || null;
    if (status) updatedData.status = status;

    if (Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({
      where: {
        id: params.id,
      },
      data: updatedData,
    });

    return NextResponse.json(
      { message: "Task updated successfully", task },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
