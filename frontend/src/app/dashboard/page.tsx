"use client"
import { TaskDashboard } from "@/components/task-dashboard"
import { getTasksData } from "@/lib/data"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { useAuth } from "@/hooks/useAuth"
import Spinner from "@/components/ui/spinner"

export default function DashboardPage() {
    useAuthGuard()
    const { isLoading, isAuthenticated, userData } = useAuth()
    if (isLoading || !isAuthenticated) return <Spinner />

    const { tasks, stats } = getTasksData()

    return (
        <div className="min-h-screen bg-background">
            <TaskDashboard tasks={tasks} stats={userData.tasks} />
        </div>
    )
}
