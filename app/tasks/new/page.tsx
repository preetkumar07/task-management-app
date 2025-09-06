"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import type { Task, TaskFormData } from "@/types/task"

export default function NewTaskPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "medium",
    category: "",
    dueDate: "",
  })
  const [errors, setErrors] = useState<Partial<TaskFormData>>({})

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
    } else {
      const dueDate = new Date(formData.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (dueDate < today) {
        newErrors.dueDate = "Due date cannot be in the past"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create new task
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: "pending",
        priority: formData.priority,
        category: formData.category.trim(),
        dueDate: formData.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Save to localStorage
      const existingTasks = JSON.parse(localStorage.getItem("taskflow-tasks") || "[]")
      const updatedTasks = [...existingTasks, newTask]
      localStorage.setItem("taskflow-tasks", JSON.stringify(updatedTasks))

      // Redirect to tasks page
      router.push("/tasks")
    } catch (error) {
      console.error("Error creating task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
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
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Create New Task</h1>
            <p className="text-muted-foreground">Add a new task to your workflow</p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-accent" />
                Task Details
              </CardTitle>
              <CardDescription>Fill in the information below to create your new task</CardDescription>
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

                {/* Priority and Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate}</p>}
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Creating Task..." : "Create Task"}
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
