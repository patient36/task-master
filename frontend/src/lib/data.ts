import type { Task, TaskStats } from "@/lib/types"

export function getTasksData(): { tasks: Task[]; stats: TaskStats } {
    const tasks: Task[] = [
        {
            id: "task-1",
            title: "Complete project proposal",
            description: "Draft and submit the project proposal for client review",
            status: "CANCELLED",
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
            status: "CANCELLED",
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
            status: "COMPLETED",
            dueDate: "2023-05-25",
            priority: "NORMAL",
        },
        {
            id: "task-7",
            title: "Conduct user testing",
            description: "Organize and conduct user testing sessions for the beta version",
            status: "COMPLETED",
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
        {
            id: "task-9",
            title: "Write unit tests",
            description: "Create unit tests for core functionality",
            status: "OVERDUE",
            priority: "NORMAL",
            dueDate: "2025-05-17",
        },
        {
            id: "task-10",
            title: "Deploy to production",
            description: "Deploy the latest changes to production",
            status: "PENDING",
            priority: "HIGH",
            dueDate: "2025-05-31",
        },
        
        {
            id: "task-11",
            title: "Complete project proposal",
            description: "Draft and finalize the project proposal for the client meeting",
            status: "PENDING",
            priority: "HIGH",
            dueDate: "2025-05-25",
        },
        {
            id: "task-12",
            title: "Review design mockups",
            description: "Review and provide feedback on the latest design mockups",
            status: "COMPLETED",
            priority: "NORMAL",
            dueDate: "2025-05-20",
        },
        {
            id: "task-13",
            title: "Fix navigation bug",
            description: "Address the navigation issue reported in the mobile app",
            status: "OVERDUE",
            priority: "HIGH",
            dueDate: "2025-05-18",
        },
        {
            id: "task-14",
            title: "Update documentation",
            description: "Update the API documentation with the latest changes",
            status: "PENDING",
            priority: "LOW",
            dueDate: "2025-05-30",
        },
        {
            id: "task-15",
            title: "Client meeting preparation",
            description: "Prepare slides and talking points for the upcoming client meeting",
            status: "CANCELLED",
            priority: "NORMAL",
            dueDate: "2025-05-22",
        },
        {
            id: "task-16",
            title: "Implement user authentication",
            description: "Add user authentication to the application",
            status: "PENDING",
            priority: "HIGH",
            dueDate: "2025-05-28",
        },
        {
            id: "task-17",
            title: "Create dashboard UI",
            description: "Design and implement the dashboard UI",
            status: "COMPLETED",
            priority: "NORMAL",
            dueDate: "2025-05-15",
        },
        {
            id: "task-18",
            title: "Optimize database queries",
            description: "Improve performance of database queries",
            status: "PENDING",
            priority: "HIGH",
            dueDate: "2025-05-29",
        },
    ]


    const stats: TaskStats = {
        total: tasks.length,
        pending: tasks.filter((task) => task.status === "PENDING").length,
        completed: tasks.filter((task) => task.status === "COMPLETED").length,
        overdue: tasks.filter((task) => task.status === "OVERDUE").length,
        cancelled: tasks.filter((task) => task.status === "CANCELLED").length
    }

    return { tasks, stats }
}