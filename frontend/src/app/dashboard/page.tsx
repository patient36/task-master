"use client"
import { TaskDashboard } from "@/components/task-dashboard"
import { useTasks } from "@/hooks/useTasks"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { useAuth } from "@/hooks/useAuth"
import Spinner from "@/components/ui/spinner"
import { useState } from "react"

export default function DashboardPage() {
  const { isLoading, isAuthenticated, userData } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [status, setStatus] = useState<string | null>(null)
  const tasksData = useTasks(page, limit, status)
  useAuthGuard()

  if (isLoading || !isAuthenticated) return <Spinner />

  const handlePageChange = (page: number) => {
    setPage(page)
  }

  const handleLimitChange = (limit: number) => {
    setLimit(limit)
    setPage(1)
  }

  const handleStatusChange = (newStatus: string | null) => {
    setStatus(newStatus)
    setPage(1)
  }

  const fetchTasks = async (statusFilter: string | null, pageNum: number, limitNum: number) => {
    return {
      tasks: tasksData.data.tasks || [],
      total: userData.tasks.total || 0,
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TaskDashboard
        tasks={tasksData.data.tasks || []}
        stats={userData.tasks}
        onFetchTasks={fetchTasks}
        currentPage={page}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleLimitChange}
        onStatusChange={handleStatusChange}
        isLoading={tasksData.isLoading}
      />
    </div>
  )
}
