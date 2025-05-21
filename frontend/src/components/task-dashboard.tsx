"use client"

import type React from "react"

import {
  CheckCircle2,
  Circle,
  Clock,
  ListTodo,
  MoreHorizontal,
  Plus,
  Trash2,
  Edit,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Task, TaskStats } from "@/lib/types"
import { useState, useEffect } from "react"
import { NewTaskModal } from "@/components/dashboard/new-task-modal"
import { TaskViewModal } from "@/components/dashboard/task-view-modal"
import { EditTaskModal } from "@/components/dashboard/edit-task-modal"
import { Toaster } from "react-hot-toast"
import { toast } from "react-hot-toast"
import { SearchBar } from "@/components/search-bar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskDashboardProps {
  tasks: Task[]
  stats: TaskStats
  onFetchTasks?: (status: string | null, page: number, limit: number) => Promise<{ tasks: Task[]; total: number }>
}

export function TaskDashboard({ tasks: initialTasks, stats, onFetchTasks }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  // const [stats, setStats] = useState<TaskStats>(initialStats)
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskViewModalOpen, setIsTaskViewModalOpen] = useState(false)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalItems, setTotalItems] = useState(initialTasks.length)
  const [activeTab, setActiveTab] = useState("all")

  // Fetch tasks when page or tab changes
  useEffect(() => {
    if (onFetchTasks) {
      fetchTasks()
    } else {
      // If no fetch function provided, use the initial tasks and filter by status
      const filteredTasks = filterTasksByStatus(initialTasks, activeTab)
      const total = filteredTasks.length
      const start = (currentPage - 1) * itemsPerPage
      const end = start + itemsPerPage

      setTasks(filteredTasks.slice(start, end))
      setTotalItems(total)
      setTotalPages(Math.ceil(total / itemsPerPage))
    }
  }, [currentPage, activeTab, itemsPerPage, onFetchTasks])

  const filterTasksByStatus = (tasks: Task[], status: string): Task[] => {
    if (status === "all") return tasks
    return tasks.filter((task) => task.status === status.toUpperCase())
  }

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const status = activeTab === "all" ? null : activeTab.toUpperCase()
      const result = await onFetchTasks!(status, currentPage, itemsPerPage)

      setTasks(result.tasks)
      setTotalItems(result.total)
      setTotalPages(Math.ceil(result.total / itemsPerPage))
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast.error("Failed to fetch tasks")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1) // Reset to first page when changing tabs
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = Number.parseInt(value, 10)
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const handleAddTask = (newTask: Task) => {
    if (onFetchTasks) {
      // If using external data source, refetch tasks
      fetchTasks()
    } else {
      const updatedTasks = [...tasks, newTask]
      setTasks(updatedTasks)
    }
  }

  const handleSaveTask = (updatedTask: Task) => {
    if (onFetchTasks) {
      // If using external data source, refetch tasks
      fetchTasks()
    } else {
      const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      setTasks(updatedTasks)
    }
  }

  const handleEditTask = (task: Task) => {
    console.log("Edit task called with:", task)
    setSelectedTask(task)
    setIsEditTaskModalOpen(true)
    // Close the TaskViewModal if it's open
    if (isTaskViewModalOpen) {
      setIsTaskViewModalOpen(false)
    }
  }

  const handleStatusChange = (taskId: string, newStatus: string) => {
    if (onFetchTasks) {
      // If using external data source, refetch tasks
      fetchTasks()
      toast.success(`Task marked as ${newStatus.toLowerCase()}`)
    } else {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus as "PENDING" | "COMPLETED" | "OVERDUE" | "CANCELLED" } : task,
      )
      setTasks(updatedTasks)
      toast.success(`Task marked as ${newStatus.toLowerCase()}`)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    if (onFetchTasks) {
      // If using external data source, refetch tasks
      fetchTasks()
      toast.success("Task deleted successfully!")
    } else {
      const updatedTasks = tasks.filter((task) => task.id !== taskId)
      setTasks(updatedTasks)
      toast.success("Task deleted successfully!")
    }
  }

  // Generate pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    pages.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>,
    )

    // First page
    if (startPage > 1) {
      pages.push(
        <Button
          key="1"
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={isLoading}
        >
          1
        </Button>,
      )

      if (startPage > 2) {
        pages.push(
          <Button key="ellipsis1" variant="outline" size="sm" disabled>
            ...
          </Button>,
        )
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          disabled={isLoading}
        >
          {i}
        </Button>,
      )
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <Button key="ellipsis2" variant="outline" size="sm" disabled>
            ...
          </Button>,
        )
      }

      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={isLoading}
        >
          {totalPages}
        </Button>,
      )
    }

    // Next button
    pages.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>,
    )

    return <div className="flex justify-center mt-6 gap-2">{pages}</div>
  }

  // Render items per page selector
  const renderItemsPerPageSelector = () => {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Show</span>
        <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue placeholder="5" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span>per page</span>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster position="top-right" />
      <div className="flex flex-1">
        <div className="hidden md:block">
          <div className="hidden h-full md:block">
            <div className="sidebar-container h-full"></div>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <div className="flex items-center gap-4">
                <SearchBar
                  onViewTask={(task) => {
                    console.log("Search result clicked:", task) // Add logging for debugging
                    setSelectedTask(task)
                    setIsTaskViewModalOpen(true)
                  }}
                />
                <Button onClick={() => setIsNewTaskModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <Progress value={(stats.pending / stats.total) * 100} className="mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completed}</div>
                  <Progress value={(stats.completed / stats.total) * 100} className="mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.overdue}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.overdue > 0 ? "Requires attention" : "All tasks on schedule"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.cancelled}</div>
                  <p className={`text-xs text-muted-foreground ${stats.cancelled > 0 ? "line-through" : ""}`}>
                    {stats.cancelled > 0 ? "Cancelled tasks" : "No tasks cancelled"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="all" onValueChange={handleTabChange}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">{renderItemsPerPageSelector()}</div>
              </div>

              <TabsContent value="all" className="mt-4 space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onViewTask={(task) => {
                        setSelectedTask(task)
                        setIsTaskViewModalOpen(true)
                      }}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      onMarkCompleted={(taskId) => handleStatusChange(taskId, "COMPLETED")}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No tasks found</div>
                )}
                {tasks.length > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {tasks.length} of {totalItems} tasks
                    </div>
                    {renderPagination()}
                    <div className="w-[150px]"></div> {/* Spacer for alignment */}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending" className="mt-4 space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onViewTask={(task) => {
                        setSelectedTask(task)
                        setIsTaskViewModalOpen(true)
                      }}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      onMarkCompleted={(taskId) => handleStatusChange(taskId, "COMPLETED")}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No pending tasks found</div>
                )}
                {tasks.length > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {tasks.length} of {totalItems} tasks
                    </div>
                    {renderPagination()}
                    <div className="w-[150px]"></div> {/* Spacer for alignment */}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-4 space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onViewTask={(task) => {
                        setSelectedTask(task)
                        setIsTaskViewModalOpen(true)
                      }}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      onMarkCompleted={(taskId) => handleStatusChange(taskId, "COMPLETED")}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No completed tasks found</div>
                )}
                {tasks.length > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {tasks.length} of {totalItems} tasks
                    </div>
                    {renderPagination()}
                    <div className="w-[150px]"></div> {/* Spacer for alignment */}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="overdue" className="mt-4 space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onViewTask={(task) => {
                        setSelectedTask(task)
                        setIsTaskViewModalOpen(true)
                      }}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      onMarkCompleted={(taskId) => handleStatusChange(taskId, "COMPLETED")}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No overdue tasks found</div>
                )}
                {tasks.length > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {tasks.length} of {totalItems} tasks
                    </div>
                    {renderPagination()}
                    <div className="w-[150px]"></div> {/* Spacer for alignment */}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="cancelled" className="mt-4 space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onViewTask={(task) => {
                        setSelectedTask(task)
                        setIsTaskViewModalOpen(true)
                      }}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      onMarkCompleted={(taskId) => handleStatusChange(taskId, "COMPLETED")}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No cancelled tasks found</div>
                )}
                {tasks.length > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {tasks.length} of {totalItems} tasks
                    </div>
                    {renderPagination()}
                    <div className="w-[150px]"></div> {/* Spacer for alignment */}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />
      <TaskViewModal
        isOpen={isTaskViewModalOpen}
        onClose={() => {
          setIsTaskViewModalOpen(false)
          setSelectedTask(null) // Clear selected task when closing
        }}
        task={selectedTask}
        onEdit={handleEditTask}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteTask}
      />
      <EditTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => setIsEditTaskModalOpen(false)}
        task={selectedTask}
        onSave={handleSaveTask}
      />
    </div>
  )
}

interface TaskItemProps {
  task: Task
  onViewTask?: (task: Task) => void
  onEditTask?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
  onMarkCompleted?: (taskId: string) => void
}

function TaskItem({ task, onViewTask, onEditTask, onDeleteTask, onMarkCompleted }: TaskItemProps) {
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onViewTask && onViewTask(task)}
    >
      <CardContent className="p-0">
        <div className="flex items-start p-4">
          <div className="mr-4 mt-1">
            {task.status === "COMPLETED" ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : task.status === "PENDING" ? (
              <Clock className="h-5 w-5 text-blue-500" />
            ) : task.status === "OVERDUE" ? (
              <Clock className="h-5 w-5 text-red-500" />
            ) : task.status === "CANCELLED" ? (
              <XCircle className="h-5 w-5 dark:text-slate-300 text-slate-600" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{task.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={handleDropdownClick}>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditTask && onEditTask(task)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onMarkCompleted && onMarkCompleted(task.id)
                    }}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    Mark as completed
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteTask && onDeleteTask(task.id)
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground">{task.description}</p>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <div className="flex items-center">
                <ListTodo className="mr-1 h-3 w-3" />
                <span>Due: {task.dueDate}</span>
              </div>
              {task.priority && (
                <div className="ml-4 flex items-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${task.priority === "HIGH"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : task.priority === "NORMAL"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                  >
                    {task.priority}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
