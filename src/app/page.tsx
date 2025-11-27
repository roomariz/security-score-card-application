'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, AlertTriangle, CheckCircle, Lock, Mail, Key, ListTodo, RefreshCw } from 'lucide-react'
import { SecurityScore } from '@/components/security-score'
import { PasswordAnalyzer } from '@/components/password-analyzer'
import { BreachChecker } from '@/components/breach-checker'
import { TwoFaChecker } from '@/components/twofa-checker'
import { TodoList } from '@/components/todo-list'

export default function Home() {
  const [securityScore, setSecurityScore] = useState(0)
  const [lastScan, setLastScan] = useState<Date | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState({
    emailAnalyzed: false,
    breachCheckDone: false,
    twoFaChecked: false,
    passwordScore: 0,
    breachCount: 0,
    twoFaEnabled: false
  })

  const runSecurityScan = async () => {
    setIsScanning(true)
    
    // Simulate security scan
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newResults = {
      emailAnalyzed: true,
      breachCheckDone: true,
      twoFaChecked: true,
      passwordScore: Math.floor(Math.random() * 40) + 60, // 60-100
      breachCount: Math.floor(Math.random() * 5),
      twoFaEnabled: Math.random() > 0.5
    }
    
    setScanResults(newResults)
    
    // Calculate overall security score
    const passwordWeight = 0.4
    const breachWeight = 0.3
    const twoFaWeight = 0.3
    
    const passwordScoreNorm = newResults.passwordScore / 100
    const breachScoreNorm = Math.max(0, (5 - newResults.breachCount) / 5)
    const twoFaScoreNorm = newResults.twoFaEnabled ? 1 : 0
    
    const overallScore = Math.round(
      (passwordScoreNorm * passwordWeight + 
       breachScoreNorm * breachWeight + 
       twoFaScoreNorm * twoFaWeight) * 100
    )
    
    setSecurityScore(overallScore)
    setLastScan(new Date())
    setIsScanning(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Security Scorecard</h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Get a comprehensive security assessment of your digital life. Check for password reuse, 
            data breaches, 2FA setup, and more.
          </p>
        </div>

        {/* Main Score Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Your Security Score</CardTitle>
            <CardDescription>
              {lastScan ? `Last scanned: ${lastScan.toLocaleString()}` : 'No scan performed yet'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <SecurityScore score={securityScore} size="large" />
              <div className="text-center space-y-2">
                <div className={`text-3xl font-bold ${getScoreColor(securityScore)}`}>
                  {securityScore}/100
                </div>
                <Badge variant={securityScore >= 80 ? 'default' : securityScore >= 60 ? 'secondary' : 'destructive'}>
                  {getScoreLabel(securityScore)}
                </Badge>
              </div>
              <Button 
                onClick={runSecurityScan} 
                disabled={isScanning}
                className="w-full max-w-xs"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Run Security Scan
                  </>
                )}
              </Button>
            </div>

            {/* Quick Stats */}
            {securityScore > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium">Password Health</span>
                  </div>
                  <div className="text-lg font-semibold">{scanResults.passwordScore}%</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium">Breaches Found</span>
                  </div>
                  <div className="text-lg font-semibold">{scanResults.breachCount}</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Key className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium">2FA Status</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {scanResults.twoFaEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Analysis Tabs */}
        {securityScore > 0 && (
          <Tabs defaultValue="passwords" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="passwords" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Passwords
              </TabsTrigger>
              <TabsTrigger value="breaches" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Breaches
              </TabsTrigger>
              <TabsTrigger value="twofa" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                2FA
              </TabsTrigger>
              <TabsTrigger value="todos" className="flex items-center gap-2">
                <ListTodo className="h-4 w-4" />
                To-Do List
              </TabsTrigger>
            </TabsList>

            <TabsContent value="passwords">
              <PasswordAnalyzer score={scanResults.passwordScore} />
            </TabsContent>

            <TabsContent value="breaches">
              <BreachChecker breachCount={scanResults.breachCount} />
            </TabsContent>

            <TabsContent value="twofa">
              <TwoFaChecker enabled={scanResults.twoFaEnabled} />
            </TabsContent>

            <TabsContent value="todos">
              <TodoList securityScore={securityScore} scanResults={scanResults} />
            </TabsContent>
          </Tabs>
        )}

        {/* Initial State Alert */}
        {securityScore === 0 && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Ready to assess your security? Click "Run Security Scan" above to get started with your comprehensive security analysis.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}