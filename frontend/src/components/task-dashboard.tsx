"use client"

import type React from "react"

import { CheckCircle2, Circle, Clock, ListTodo, MoreHorizontal, Plus, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Task, TaskStats } from "@/lib/types"
import { useState } from "react"
import { NewTaskModal } from "@/components/dashboard/new-task-modal"
import { TaskViewModal } from "@/components/dashboard/task-view-modal"
import { EditTaskModal } from "@/components/dashboard/edit-task-modal"
import { Toaster } from "react-hot-toast"

interface TaskDashboardProps {
  tasks: Task[]
  stats: TaskStats
}

export function TaskDashboard({ tasks: initialTasks, stats: initialStats }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [stats, setStats] = useState<TaskStats>(initialStats)
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskViewModalOpen, setIsTaskViewModalOpen] = useState(false)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)

  const handleAddTask = (newTask: Task) => {
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)

    // Update stats
    const newStats = {
      total: updatedTasks.length,
      pending: updatedTasks.filter((task) => task.status === "PENDING").length,
      completed: updatedTasks.filter((task) => task.status === "COMPLETED").length,
      overdue: updatedTasks.filter((task) => task.status === "OVERDUE").length,
      cancelled: updatedTasks.filter((task) => task.status === "CANCELLED").length,
    }

    setStats(newStats)
  }

  const handleSaveTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))

    setTasks(updatedTasks)

    // Update stats
    const newStats = {
      total: updatedTasks.length,
      pending: updatedTasks.filter((task) => task.status === "PENDING").length,
      completed: updatedTasks.filter((task) => task.status === "COMPLETED").length,
      overdue: updatedTasks.filter((task) => task.status === "OVERDUE").length,
      cancelled: updatedTasks.filter((task) => task.status === "CANCELLED").length,
    }

    setStats(newStats)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsEditTaskModalOpen(true)
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
              <Button onClick={() => setIsNewTaskModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
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

            <Tabs defaultValue="all">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-4 space-y-4">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onViewTask={(task) => {
                      setSelectedTask(task)
                      setIsTaskViewModalOpen(true)
                    }}
                    onEditTask={handleEditTask}
                  />
                ))}
              </TabsContent>

              <TabsContent value="pending" className="mt-4 space-y-4">
                {tasks
                  .filter((task) => task.status === "PENDING")
                  .map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onViewTask={(task) => {
                        setSelectedTask(task)
                        setIsTaskViewModalOpen(true)
                      }}
                      onEditTask={handleEditTask}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="completed" className="mt-4 space-y-4">
                {tasks
                  .filter((task) => task.status === "COMPLETED")
                  .map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onViewTask={(task) => {
                        setSelectedTask(task)
                        setIsTaskViewModalOpen(true)
                      }}
                      onEditTask={handleEditTask}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="overdue" className="mt-4 space-y-4">
                {tasks
                  .filter((task) => task.status === "OVERDUE")
                  .map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onViewTask={(task) => {
                        setSelectedTask(task)
                        setIsTaskViewModalOpen(true)
                      }}
                      onEditTask={handleEditTask}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="cancelled" className="mt-4 space-y-4">
                {tasks
                  .filter((task) => task.status === "CANCELLED")
                  .map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onViewTask={(task) => {
                        setSelectedTask(task)
                        setIsTaskViewModalOpen(true)
                      }}
                      onEditTask={handleEditTask}
                    />
                  ))}
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
        onClose={() => setIsTaskViewModalOpen(false)}
        task={selectedTask}
        onEdit={handleEditTask}
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
}

function TaskItem({ task, onViewTask, onEditTask }: TaskItemProps) {
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
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>Mark as completed</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
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
