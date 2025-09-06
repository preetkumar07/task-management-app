export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  category: string
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description: string
  priority: "low" | "medium" | "high"
  category: string
  dueDate: string
}
