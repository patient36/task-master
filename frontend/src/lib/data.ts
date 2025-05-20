import type { Task, TaskStats } from "@/lib/types"

export function getTasksData(): { tasks: Task[]; stats: TaskStats } {
    const tasks: Task[] = [
        {
            id: "task-1",
            title: "Complete project proposal",
            description: "Draft and submit the project proposal for client review",
            status: "COMPLETED",
            dueDate: "2023-05-10",
            priority: "HIGH",
        },
        {
            id: "task-2",
            title: "Design user interface mockups",
            description: "Create mockups for the dashboard and user profile pages",
            status: "PENDING",
            dueDate: "2023-05-15",
            priority: "NORMAL",
        },
        {
            id: "task-3",
            title: "Implement authentication system",
            description: "Set up user authentication with JWT and role-based access control",
            status: "PENDING",
            dueDate: "2023-05-18",
            priority: "HIGH",
        },
        {
            id: "task-4",
            title: "Write API documentation",
            description: "Document all API endpoints and request/response formats",
            status: "PENDING",
            dueDate: "2023-05-20",
            priority: "LOW",
        },
        {
            id: "task-5",
            title: "Fix navigation bug on mobile",
            description: "Address the navigation menu not closing on mobile after selection",
            status: "OVERDUE",
            dueDate: "2023-05-08",
            priority: "HIGH",
        },
        {
            id: "task-6",
            title: "Set up CI/CD pipeline",
            description: "Configure GitHub Actions for automated testing and deployment",
            status: "PENDING",
            dueDate: "2023-05-25",
            priority: "NORMAL",
        },
        {
            id: "task-7",
            title: "Conduct user testing",
            description: "Organize and conduct user testing sessions for the beta version",
            status: "PENDING",
            dueDate: "2023-05-30",
            priority: "NORMAL",
        },
        {
            id: "task-8",
            title: "Deploy to production",
            description: "Deploy the application to the production environment",
            status: "PENDING",
            dueDate: "2023-06-05",
            priority: "HIGH",
        },
    ]

    const stats: TaskStats = {
        total: tasks.length,
        pending: tasks.filter((task) => task.status === "PENDING").length,
        completed: tasks.filter((task) => task.status === "COMPLETED").length,
        overdue: tasks.filter((task) => task.status === "OVERDUE").length,
        cancelled: tasks.filter((task) => task.status === "CANCELLED").length,
        highPriority: tasks.filter((task) => task.priority === "HIGH").length,
        normalPriority: tasks.filter((task) => task.priority === "NORMAL").length,
        lowPriority: tasks.filter((task) => task.priority === "LOW").length,
    }

    return { tasks, stats }
}

export const user = {
    id: "user-1",
    name: "Hubert Blaine Wolfeschlegelsteinhausenbergerdorff",
    email: "hubert.wolfeschlegelstein@example.com",
    createdAt: "2023-01-15T00:00:00Z",
    role: "ADMIN",
}