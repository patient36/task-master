"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Clock, XCircle, Calendar, AlertCircle, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Task } from "@/lib/types"

interface TaskViewModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
  onEdit: (task: Task) => void
  onStatusChange?: (taskId: string, newStatus: string) => void
  onDelete?: (taskId: string) => void
}

export function TaskViewModal({ isOpen, onClose, task, onEdit, onStatusChange, onDelete }: TaskViewModalProps) {
  const [isStatusChanging, setIsStatusChanging] = useState(false)

  if (!task) return null

  const getStatusIcon = () => {
    switch (task.status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "PENDING":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "OVERDUE":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "CANCELLED":
        return <XCircle className="h-5 w-5 dark:text-slate-300 text-slate-600" />
      default:
        return null
    }
  }

  const getPriorityBadge = () => {
    if (!task.priority) return null

    const colorMap = {
      HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      NORMAL: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      LOW: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    }

    return <Badge className={`${colorMap[task.priority as keyof typeof colorMap]} font-medium`}>{task.priority}</Badge>
  }

  const handleStatusChange = (newStatus: string) => {
    if (!task || !onStatusChange) return

    onStatusChange(task.id, newStatus)
  }

  const handleDeleteTask = () => {
    if (!task || !onDelete) return
    onDelete(task.id)
    onClose()
  }

  const handleEditClick = () => {
    console.log("Edit button clicked in TaskViewModal with task:", task)
    if (onEdit) {
      onEdit(task)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "No date set"

    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <DialogTitle>{task.title}</DialogTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="outline-none focus:outline-none">
                  <MoreHorizontal className="h-2 w-2" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditClick}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("COMPLETED")}>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}>
                  <Clock className="mr-2 h-4 w-4 text-blue-500" />
                  Mark as Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("OVERDUE")}>
                  <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                  Mark as Overdue
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("CANCELLED")}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Mark as Cancelled
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteTask} className="text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DialogDescription>Task ID: {task.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <p className="text-sm text-muted-foreground max-h-40 overflow-auto pr-2">
              {task.description || "No description provided"}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Status</h4>
              <div className="flex items-center gap-1.5">
                {getStatusIcon()}
                <span className="text-sm">{task.status}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Priority</h4>
              <div>{getPriorityBadge() || <span className="text-sm text-muted-foreground">Not set</span>}</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Due Date</h4>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{formatDate(task.dueDate)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="default" onClick={handleEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
