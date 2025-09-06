"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Edit, Trash2, CheckCircle2, Clock, AlertCircle, Calendar } from "lucide-react"
import { Navigation } from "@/components/navigation"
import type { Task } from "@/types/task"
import { cn } from "@/lib/utils"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("dueDate")

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem("taskflow-tasks")
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks)
      setTasks(parsedTasks)
      setFilteredTasks(parsedTasks)
    }
  }, [])

  useEffect(() => {
    // Filter and sort tasks
    const filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    setFilteredTasks(filtered)
  }, [tasks, searchTerm, statusFilter, priorityFilter, sortBy])

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)
    localStorage.setItem("taskflow-tasks", JSON.stringify(updatedTasks))
  }

  const handleToggleStatus = (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const newStatus = task.status === "completed" ? "pending" : "completed"
        return { ...task, status: newStatus, updatedAt: new Date().toISOString() }
      }
      return task
    })
    setTasks(updatedTasks)
    localStorage.setItem("taskflow-tasks", JSON.stringify(updatedTasks))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const isOverdue = (dueDate: string, status: string) => {
    return status !== "completed" && new Date(dueDate) < new Date()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">All Tasks</h1>
            <p className="text-muted-foreground">Manage and track all your tasks</p>
          </div>
          <Link href="/tasks/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground flex items-center">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        {filteredTasks.length > 0 ? (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <Card
                key={task.id}
                className={cn(
                  "border-border transition-all hover:shadow-md",
                  isOverdue(task.dueDate, task.status) &&
                    "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <button
                        onClick={() => handleToggleStatus(task.id)}
                        className="mt-1 hover:scale-110 transition-transform"
                      >
                        {getStatusIcon(task.status)}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            className={cn(
                              "text-lg font-semibold text-foreground",
                              task.status === "completed" && "line-through text-muted-foreground",
                            )}
                          >
                            {task.title}
                          </h3>
                          {isOverdue(task.dueDate, task.status) && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>

                        <p className="text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {task.priority} priority
                          </Badge>

                          <Badge variant="outline">{task.category}</Badge>

                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/tasks/${task.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {tasks.length === 0 ? "No tasks yet" : "No tasks match your filters"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {tasks.length === 0
                  ? "Get started by creating your first task"
                  : "Try adjusting your search or filter criteria"}
              </p>
              {tasks.length === 0 && (
                <Link href="/tasks/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
