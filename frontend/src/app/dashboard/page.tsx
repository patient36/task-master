"use client"

import { useState, useCallback } from "react"
import { TaskDashboard } from "@/components/task-dashboard"
import Spinner from "@/components/ui/spinner"
import { useTasks } from "@/hooks/useTasks"
import { useAuth } from "@/hooks/useAuth"
import { useAuthGuard } from "@/hooks/useAuthGuard"

export default function DashboardPage() {
    useAuthGuard()

    const { isLoading: authLoading, isAuthenticated } = useAuth()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [status, setStatus] = useState<string | null>(null)

    const { data, isLoading: tasksLoading } = useTasks(page, limit, status)

    const handlePageChange = useCallback((p: number) => setPage(p), [])
    const handleLimitChange = useCallback((l: number) => {
        setLimit(l)
        setPage(1)
    }, [])
    const handleStatusChange = useCallback((s: string | null) => {
        setStatus(s)
        setPage(1)
    }, [])

    if (authLoading || !isAuthenticated || tasksLoading || !data) return <Spinner />

    return (
        <div className="min-h-screen bg-background">
            <TaskDashboard
                tasks={data.tasks || []}
                stats={data.stats}
                totalPages={data.totalPages}
                totalItems={data.total}
                currentPage={page}
                itemsPerPage={limit}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleLimitChange}
                onStatusChange={handleStatusChange}
                isLoading={tasksLoading}
            />
        </div>
    )
}
