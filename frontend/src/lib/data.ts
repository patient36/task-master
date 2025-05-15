import type { Task, TaskStats } from "@/lib/types"

export function getTasksData(): { tasks: Task[]; stats: TaskStats } {
    // In a real app, this would fetch from an API or database
    const tasks: Task[] = [
        {
            id: "task-1",
            title: "Complete project proposal",
            description: "Draft and submit the project proposal for client review",
            status: "completed",
            dueDate: "2023-05-10",
            priority: "high",
            assignee: "John Doe",
        },
        {
            id: "task-2",
            title: "Design user interface mockups",
            description: "Create mockups for the dashboard and user profile pages",
            status: "in-progress",
            dueDate: "2023-05-15",
            priority: "medium",
            assignee: "Jane Smith",
        },
        {
            id: "task-3",
            title: "Implement authentication system",
            description: "Set up user authentication with JWT and role-based access control",
            status: "in-progress",
            dueDate: "2023-05-18",
            priority: "high",
            assignee: "John Doe",
        },
        {
            id: "task-4",
            title: "Write API documentation",
            description: "Document all API endpoints and request/response formats",
            status: "todo",
            dueDate: "2023-05-20",
            priority: "low",
        },
        {
            id: "task-5",
            title: "Fix navigation bug on mobile",
            description: "Address the navigation menu not closing on mobile after selection",
            status: "overdue",
            dueDate: "2023-05-08",
            priority: "high",
            assignee: "Jane Smith",
        },
        {
            id: "task-6",
            title: "Set up CI/CD pipeline",
            description: "Configure GitHub Actions for automated testing and deployment",
            status: "todo",
            dueDate: "2023-05-25",
            priority: "medium",
        },
        {
            id: "task-7",
            title: "Conduct user testing",
            description: "Organize and conduct user testing sessions for the beta version",
            status: "todo",
            dueDate: "2023-05-30",
            priority: "medium",
            assignee: "John Doe",
        },
    ]

    const stats: TaskStats = {
        total: tasks.length,
        inProgress: tasks.filter((task) => task.status === "in-progress").length,
        completed: tasks.filter((task) => task.status === "completed").length,
        overdue: tasks.filter((task) => task.status === "overdue").length,
        newToday: 2, // Mock value
    }

    return { tasks, stats }
}
