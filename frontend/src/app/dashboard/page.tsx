import { TaskDashboard } from "@/components/task-dashboard"
import { getTasksData } from "@/lib/data"

export default function DashboardPage() {
    const { tasks, stats } = getTasksData()

    return (
        <div className="min-h-screen bg-background">
            <TaskDashboard tasks={tasks} stats={stats} />
        </div>
    )
}
