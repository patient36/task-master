export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "completed" | "overdue"
  dueDate: string
  priority?: "low" | "medium" | "high"
  assignee?: string
}

export interface TaskStats {
  total: number
  inProgress: number
  completed: number
  overdue: number
  newToday: number
}
