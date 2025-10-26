import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAuthSession } from "@/lib/nextauth";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date } = await request.json();

    // Get start and end of day
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Fetch data for the day
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
            description: true,
            status: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    const taskIds = [...new Set(timeLogs.map((log) => log.taskId))];
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
          orderBy: {
            startTime: "asc",
          },
        },
      },
    });

    // Calculate statistics
    const totalTimeTracked = timeLogs.reduce(
      (sum, log) => sum + (log.duration || 0),
      0
    );
    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "IN_PROGRESS"
    ).length;
    const pendingTasks = tasks.filter((t) => t.status === "PENDING").length;

    // Prepare detailed task data with time session breakdowns
    const taskDetails = tasks.map((task) => {
      const sessions = task.timeLogs.map((log) => ({
        startTime: new Date(log.startTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        endTime: log.endTime
          ? new Date(log.endTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "In Progress",
        duration: log.duration || 0,
      }));

      const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
      const avgSessionTime =
        sessions.length > 0 ? totalTime / sessions.length : 0;

      return {
        title: task.title,
        description: task.description,
        status: task.status,
        totalTime,
        sessions: sessions.length,
        avgSessionTime,
        sessionDetails: sessions,
        timeOfDay: sessions.length > 0 ? sessions[0].startTime : null,
      };
    });

    // Calculate time distribution patterns
    const morningTasks = taskDetails.filter((t) => t.timeOfDay?.includes("AM"));
    const afternoonTasks = taskDetails.filter(
      (t) => t.timeOfDay && !t.timeOfDay.includes("AM")
    );

    const prompt = `You are an expert productivity analyst and career coach. Analyze this day's work data deeply and provide actionable, personalized insights in markdown format.

📅 **Date:** ${targetDate.toDateString()}

## 📊 Overall Summary
- **Total Time Tracked:** ${Math.floor(totalTimeTracked / 3600)}h ${Math.floor(
      (totalTimeTracked % 3600) / 60
    )}m
- **Tasks Worked On:** ${tasks.length}
- **✅ Completed:** ${completedTasks} | **⚡ In Progress:** ${inProgressTasks} | **📋 Pending:** ${pendingTasks}
- **Morning Sessions:** ${morningTasks.length} | **Afternoon/Evening:** ${
      afternoonTasks.length
    }

## 📝 Detailed Task Analysis

${taskDetails
  .map((task, index) => {
    return `### ${index + 1}. ${task.title} [${task.status}]
${task.description ? `**Description:** ${task.description}\n` : ""}
- **Total Time:** ${Math.floor(task.totalTime / 3600)}h ${Math.floor(
      (task.totalTime % 3600) / 60
    )}m
- **Sessions:** ${task.sessions} session(s)
- **Average Session Duration:** ${Math.floor(task.avgSessionTime / 60)}min
- **Time Breakdown:**
${task.sessionDetails
  .map(
    (s, i) =>
      `  ${i + 1}. ${s.startTime} - ${s.endTime} (${Math.floor(
        s.duration / 60
      )}min)`
  )
  .join("\n")}
`;
  })
  .join("\n")}

## 🎯 Required Insights

Based on the above detailed task information, provide:

### 1. **Productivity Score (0-100)**
Give a numerical score with specific reasoning based on:
- Time utilization efficiency
- Task completion rate
- Focus session lengths
- Work distribution throughout the day

### 2. **Task-Specific Highlights** 
For each significant task, provide:
- What went well
- Optimal working patterns observed
- Time efficiency on specific tasks
Example: "Task X showed excellent focus with ${Math.floor(
      taskDetails[0]?.avgSessionTime / 60
    )}min average sessions"

### 3. **Task-Specific Recommendations**
For each task or task category:
- Time allocation suggestions
- Session length optimization
- Best time of day to work on similar tasks
- If any task took unusually long/short, suggest why

### 4. **Focus & Context Switching Analysis**
- Number of task switches
- Impact on productivity
- Suggestions for better task batching
- Ideal session lengths identified

### 5. **Time Distribution Deep Dive**
- Morning vs afternoon productivity
- Peak performance hours identified
- Task types best suited for different times
- Energy management observations

### 6. **Areas for Improvement (Actionable)**
Provide 2-3 specific, implementable suggestions like:
- "Break ${
      taskDetails[0]?.title
    } into 25-minute Pomodoro sessions instead of ${Math.floor(
      taskDetails[0]?.avgSessionTime / 60
    )}-minute blocks"
- "Schedule similar tasks together to reduce context switching"

### 7. **Tomorrow's Strategic Plan**
Based on today's patterns:
- Recommend specific time blocks for pending tasks
- Suggest task priority order
- Estimate realistic time allocations
- Identify optimal work hours based on today's data

### 8. **Pattern Recognition**
If you notice any patterns:
- Task completion efficiency by time of day
- Session length sweet spot
- Tasks that might need breakdown
- Signs of fatigue or distraction

Keep the tone professional yet encouraging. Use data-driven insights with specific numbers from the tasks. Use emojis sparingly for section headers only.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();

    return NextResponse.json({
      insights,
      date: targetDate.toISOString(),
      tasksAnalyzed: tasks.length,
      totalSessions: timeLogs.length,
    });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
