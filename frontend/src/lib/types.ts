export interface Task {
  id: string
  title: string
  description: string
  status: "COMPLETED" | "PENDING" | "CANCELLED" | "OVERDUE"
  dueTime: string
  priority?: "LOW" | "NORMAL" | "HIGH"
  creatorId?: string
  updatedAt?: string
  createdAt?: string
}

export interface TaskStats {
  total: number
  cancelled: number
  completed: number
  pending: number
  overdue: number
}