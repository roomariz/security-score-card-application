'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertTriangle, XCircle, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface PasswordAnalyzerProps {
  score: number
}

export function PasswordAnalyzer({ score }: PasswordAnalyzerProps) {
  const [showPasswordTips, setShowPasswordTips] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Strong'
    if (score >= 60) return 'Fair'
    return 'Weak'
  }

  const getPasswordIssues = () => {
    const issues: Array<{
      type: 'warning' | 'error'
      title: string
      description: string
    }> = []
    
    if (score < 80) {
      issues.push({
        type: 'warning',
        title: 'Password Strength',
        description: 'Some of your passwords may be weak or easily guessable'
      })
    }
    
    if (score < 60) {
      issues.push({
        type: 'error',
        title: 'Password Reuse',
        description: 'You may be reusing passwords across multiple accounts'
      })
    }
    
    if (score < 40) {
      issues.push({
        type: 'error',
        title: 'Common Passwords',
        description: 'You may be using common or dictionary-based passwords'
      })
    }
    
    return issues
  }

  const getPasswordTips = () => [
    {
      title: 'Use Unique Passwords',
      description: 'Never reuse passwords across different accounts. Consider using a password manager.'
    },
    {
      title: 'Make Them Long',
      description: 'Aim for at least 12-16 characters. Longer passwords are exponentially harder to crack.'
    },
    {
      title: 'Mix Character Types',
      description: 'Use uppercase, lowercase, numbers, and special characters in your passwords.'
    },
    {
      title: 'Avoid Personal Info',
      description: 'Don\'t use birthdays, names, or other personal information that can be easily found.'
    },
    {
      title: 'Enable 2FA',
      description: 'Two-factor authentication adds an extra layer of security even if passwords are compromised.'
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Analysis
          </CardTitle>
          <CardDescription>
            Analysis of your password strength and security practices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Password Health Score</span>
              <Badge variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}>
                {getScoreLabel(score)}
              </Badge>
            </div>
            <Progress value={score} className="h-2" />
            <div className={`text-right text-sm font-medium ${getScoreColor(score)}`}>
              {score}/100
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center space-y-2">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
              <div className="text-sm font-medium">Strong Passwords</div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(score * 0.8)}%
              </div>
            </div>
            <div className="text-center space-y-2">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto" />
              <div className="text-sm font-medium">Need Improvement</div>
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round((100 - score) * 0.6)}%
              </div>
            </div>
            <div className="text-center space-y-2">
              <XCircle className="h-8 w-8 text-red-500 mx-auto" />
              <div className="text-sm font-medium">At Risk</div>
              <div className="text-2xl font-bold text-red-600">
                {Math.round((100 - score) * 0.4)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues Found */}
      {getPasswordIssues().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Issues Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getPasswordIssues().map((issue, index) => (
              <Alert key={index} variant={issue.type === 'error' ? 'destructive' : 'default'}>
                {issue.type === 'error' ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="font-medium">{issue.title}</div>
                  <div className="text-sm text-slate-600">{issue.description}</div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Password Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Password Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getPasswordTips().map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">{tip.title}</div>
                  <div className="text-sm text-slate-600">{tip.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}