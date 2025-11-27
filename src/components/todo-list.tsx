'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { ListTodo, CheckCircle, AlertTriangle, Lock, Key, Shield, Plus, Calendar } from 'lucide-react'
import { useState } from 'react'

interface TodoListProps {
  securityScore: number
  scanResults: {
    passwordScore: number
    breachCount: number
    twoFaEnabled: boolean
  }
}

interface TodoItem {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'password' | '2fa' | 'breach' | 'general'
  completed: boolean
  dueDate?: string
}

export function TodoList({ securityScore, scanResults }: TodoListProps) {
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: '1',
      title: 'Change weak passwords',
      description: 'Update passwords for accounts with weak or reused passwords',
      priority: scanResults.passwordScore < 60 ? 'high' : 'medium',
      category: 'password',
      completed: false,
      dueDate: '2024-02-01'
    },
    {
      id: '2',
      title: 'Enable 2FA on high-priority accounts',
      description: 'Set up two-factor authentication on email, banking, and social media accounts',
      priority: scanResults.twoFaEnabled ? 'low' : 'high',
      category: '2fa',
      completed: false,
      dueDate: '2024-01-15'
    },
    {
      id: '3',
      title: 'Review breach notifications',
      description: 'Check and respond to any data breach alerts for your accounts',
      priority: scanResults.breachCount > 0 ? 'high' : 'low',
      category: 'breach',
      completed: false,
      dueDate: '2024-01-10'
    },
    {
      id: '4',
      title: 'Set up password manager',
      description: 'Install and configure a password manager to generate and store strong passwords',
      priority: 'medium',
      category: 'password',
      completed: false,
      dueDate: '2024-01-20'
    },
    {
      id: '5',
      title: 'Review account recovery options',
      description: 'Update recovery email addresses and phone numbers for important accounts',
      priority: 'medium',
      category: 'general',
      completed: false,
      dueDate: '2024-01-25'
    },
    {
      id: '6',
      title: 'Enable login alerts',
      description: 'Set up notifications for new logins on your important accounts',
      priority: 'low',
      category: 'general',
      completed: false,
      dueDate: '2024-02-05'
    }
  ])

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length
  const completionPercentage = Math.round((completedCount / totalCount) * 100)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      default:
        return 'text-blue-600'
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'password':
        return Lock
      case '2fa':
        return Key
      case 'breach':
        return Shield
      default:
        return ListTodo
    }
  }

  const getOverdueTodos = () => {
    const today = new Date()
    return todos.filter(todo => {
      if (!todo.dueDate || todo.completed) return false
      return new Date(todo.dueDate) < today
    })
  }

  const getUpcomingTodos = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return todos.filter(todo => {
      if (!todo.dueDate || todo.completed) return false
      const dueDate = new Date(todo.dueDate)
      return dueDate >= today && dueDate <= nextWeek
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const overdueTodos = getOverdueTodos()
  const upcomingTodos = getUpcomingTodos()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Security Action Plan
          </CardTitle>
          <CardDescription>
            Your personalized to-do list to improve your security posture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <div className="font-medium">Progress</div>
                <div className="text-sm text-slate-600">
                  {completedCount} of {totalCount} tasks completed
                </div>
              </div>
            </div>
            <Badge variant={completionPercentage >= 80 ? 'default' : 'secondary'}>
              {completionPercentage}%
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-slate-600">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm font-medium">Completed</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-yellow-600">{totalCount - completedCount}</div>
              <div className="text-sm font-medium">Pending</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-red-600">{overdueTodos.length}</div>
              <div className="text-sm font-medium">Overdue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {overdueTodos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Overdue Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueTodos.map(todo => {
                const Icon = getCategoryIcon(todo.category)
                return (
                  <div key={todo.id} className="flex items-center gap-3 p-3 rounded-lg bg-red-50">
                    <Icon className="h-5 w-5 text-red-500" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{todo.title}</div>
                      <div className="text-xs text-red-600">
                        Due: {formatDate(todo.dueDate!)}
                      </div>
                    </div>
                    <Badge variant="destructive">Overdue</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Todo List */}
      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>
            Complete these tasks to improve your security score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todos.map(todo => {
              const Icon = getCategoryIcon(todo.category)
              return (
                <div key={todo.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-slate-500" />
                      <span className={`font-medium ${todo.completed ? 'line-through text-slate-500' : ''}`}>
                        {todo.title}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">{todo.description}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityBadgeVariant(todo.priority)} className={getPriorityColor(todo.priority)}>
                        {todo.priority}
                      </Badge>
                      {todo.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(todo.dueDate)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Order</CardTitle>
          <CardDescription>
            Suggested priority order for completing your security tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50">
              <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <div className="font-medium text-sm">Address Immediate Threats</div>
                <div className="text-sm text-slate-600">
                  Change passwords for breached accounts and enable 2FA on critical services
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50">
              <div className="w-6 h-6 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <div className="font-medium text-sm">Strengthen Passwords</div>
                <div className="text-sm text-slate-600">
                  Set up a password manager and update weak passwords
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <div className="font-medium text-sm">Enable Monitoring</div>
                <div className="text-sm text-slate-600">
                  Set up login alerts and review recovery options
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}