"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Edit } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import type { Task, TaskFormData } from "@/types/task"

export default function EditTaskPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [task, setTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState<TaskFormData & { status: Task["status"] }>({
    title: "",
    description: "",
    priority: "medium",
    category: "",
    dueDate: "",
    status: "pending",
  })
  const [errors, setErrors] = useState<Partial<TaskFormData>>({})

  useEffect(() => {
    // Load task from localStorage
    const savedTasks = localStorage.getItem("taskflow-tasks")
    if (savedTasks) {
      const tasks: Task[] = JSON.parse(savedTasks)
      const foundTask = tasks.find((t) => t.id === taskId)

      if (foundTask) {
        setTask(foundTask)
        setFormData({
          title: foundTask.title,
          description: foundTask.description,
          priority: foundTask.priority,
          category: foundTask.category,
          dueDate: foundTask.dueDate,
          status: foundTask.status,
        })
      } else {
        // Task not found, redirect to tasks page
        router.push("/tasks")
        return
      }
    }
    setIsLoading(false)
  }, [taskId, router])

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !task) {
      return
    }

    setIsSubmitting(true)

    try {
      // Update task
      const updatedTask: Task = {
        ...task,
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        category: formData.category.trim(),
        dueDate: formData.dueDate,
        status: formData.status,
        updatedAt: new Date().toISOString(),
      }

      // Save to localStorage
      const existingTasks = JSON.parse(localStorage.getItem("taskflow-tasks") || "[]")
      const updatedTasks = existingTasks.map((t: Task) => (t.id === taskId ? updatedTask : t))
      localStorage.setItem("taskflow-tasks", JSON.stringify(updatedTasks))

      // Redirect to tasks page
      router.push("/tasks")
    } catch (error) {
      console.error("Error updating task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof (TaskFormData & { status: Task["status"] }), value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof TaskFormData]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading task...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Task Not Found</h1>
            <p className="text-muted-foreground mb-4">The task you're looking for doesn't exist.</p>
            <Link href="/tasks">
              <Button>Back to Tasks</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/tasks">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Edit Task</h1>
            <p className="text-muted-foreground">Update your task details</p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-accent" />
                Task Details
              </CardTitle>
              <CardDescription>Update the information below to modify your task</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your task in detail..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                {/* Status, Priority and Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: Task["status"]) => handleInputChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: "low" | "medium" | "high") => handleInputChange("priority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Work, Personal, Study..."
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className={errors.category ? "border-destructive" : ""}
                    />
                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                  </div>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    className={errors.dueDate ? "border-destructive" : ""}
                  />
                  {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate}</p>}
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Updating Task..." : "Update Task"}
                  </Button>
                  <Link href="/tasks" className="flex-1">
                    <Button type="button" variant="outline" className="w-full bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
