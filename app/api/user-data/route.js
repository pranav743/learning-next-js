import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userData = {
    user: session.user,
    stats: {
      totalProjects: 12,
      completedTasks: 45,
      activeProjects: 3,
      teamMembers: 8
    },
    recentActivity: [
      {
        id: 1,
        action: "Created new project",
        timestamp: "2024-12-15T10:30:00Z",
        project: "E-commerce Dashboard"
      },
      {
        id: 2,
        action: "Completed task",
        timestamp: "2024-12-14T15:45:00Z",
        project: "Marketing Campaign"
      },
      {
        id: 3,
        action: "Updated team member",
        timestamp: "2024-12-14T09:20:00Z",
        project: "Mobile App"
      }
    ],
    projects: [
      {
        id: 1,
        name: "E-commerce Dashboard",
        status: "In Progress",
        progress: 75,
        deadline: "2024-12-20"
      },
      {
        id: 2,
        name: "Marketing Campaign",
        status: "Completed",
        progress: 100,
        deadline: "2024-12-10"
      },
      {
        id: 3,
        name: "Mobile App",
        status: "Planning",
        progress: 25,
        deadline: "2024-12-30"
      }
    ]
  }

  return NextResponse.json(userData)
}
