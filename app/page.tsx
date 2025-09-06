"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, AlertCircle, Plus, BarChart3, Calendar, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import type { Task } from "@/types/task"

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
  })

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem("taskflow-tasks")
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks)
      setTasks(parsedTasks)

      // Calculate statistics
      const total = parsedTasks.length
      const completed = parsedTasks.filter((task: Task) => task.status === "completed").length
      const pending = parsedTasks.filter((task: Task) => task.status === "pending").length
      const overdue = parsedTasks.filter((task: Task) => {
        const dueDate = new Date(task.dueDate)
        const today = new Date()
        return task.status !== "completed" && dueDate < today
      }).length
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

      setStats({ total, completed, pending, overdue, completionRate })
    }
  }, [])

  const recentTasks = tasks.slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Welcome to TaskFlow</h1>
          <p className="text-muted-foreground text-lg">Your professional task management dashboard</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All tasks in system</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Tasks finished</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Tasks in progress</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <p className="text-xs text-muted-foreground">Tasks past due</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Completion Progress
              </CardTitle>
              <CardDescription>Overall task completion rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{stats.completionRate}%</span>
                </div>
                <Progress value={stats.completionRate} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {stats.completed} of {stats.total} tasks completed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common task management actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/tasks/new">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Task
                </Button>
              </Link>
              <Link href="/tasks">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View All Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your latest task activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          task.status === "completed"
                            ? "bg-green-500"
                            : task.status === "in-progress"
                              ? "bg-blue-500"
                              : "bg-gray-400"
                        }`}
                      />
                      <div>
                        <h4 className="font-medium text-foreground">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {task.priority}
                      </Badge>
                      <Badge variant="outline">{task.category}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No tasks yet</h3>
                <p className="text-muted-foreground mb-4">Get started by creating your first task</p>
                <Link href="/tasks/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
