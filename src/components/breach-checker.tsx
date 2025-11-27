'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ExternalLink, AlertTriangle, CheckCircle, Shield, Search } from 'lucide-react'
import { useState } from 'react'

interface BreachCheckerProps {
  breachCount: number
}

export function BreachChecker({ breachCount }: BreachCheckerProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [detailedResults, setDetailedResults] = useState<any[]>([])

  const mockBreachData = [
    {
      name: 'LinkedIn',
      date: '2021-06-01',
      compromisedAccounts: 700000000,
      dataTypes: ['Email addresses', 'Phone numbers', 'Full names'],
      severity: 'high'
    },
    {
      name: 'Facebook',
      date: '2021-04-01',
      compromisedAccounts: 530000000,
      dataTypes: ['Email addresses', 'Phone numbers', 'Full names', 'Birthdates'],
      severity: 'high'
    },
    {
      name: 'Adobe',
      date: '2013-10-01',
      compromisedAccounts: 153000000,
      dataTypes: ['Email addresses', 'Passwords', 'Credit card numbers'],
      severity: 'critical'
    }
  ]

  const runDetailedCheck = async () => {
    setIsChecking(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setDetailedResults(mockBreachData.slice(0, breachCount))
    setIsChecking(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      default:
        return 'bg-blue-500'
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'default'
      case 'medium':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Breach Analysis
          </CardTitle>
          <CardDescription>
            Check if your email or accounts have been involved in known data breaches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
            <div className="flex items-center gap-3">
              {breachCount === 0 ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-red-500" />
              )}
              <div>
                <div className="font-medium">Breaches Found</div>
                <div className="text-sm text-slate-600">
                  {breachCount === 0 
                    ? 'No known breaches detected' 
                    : `${breachCount} potential breach(es) found`
                  }
                </div>
              </div>
            </div>
            <Badge variant={breachCount === 0 ? 'default' : 'destructive'}>
              {breachCount}
            </Badge>
          </div>

          {breachCount > 0 && (
            <div className="space-y-3">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium">Action Required</div>
                  <div className="text-sm text-slate-600">
                    We found potential breaches involving your accounts. You should change passwords 
                    and enable 2FA on affected services immediately.
                  </div>
                </AlertDescription>
              </Alert>

              <Button 
                onClick={runDetailedCheck} 
                disabled={isChecking}
                className="w-full"
              >
                {isChecking ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                    Checking Detailed Results...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    View Detailed Breach Information
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Results */}
      {detailedResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Breach Information</CardTitle>
            <CardDescription>
              Specific breaches that may have affected your accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {detailedResults.map((breach, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{breach.name}</h3>
                      <p className="text-sm text-slate-600">{formatDate(breach.date)}</p>
                    </div>
                    <Badge variant={getSeverityBadgeVariant(breach.severity)}>
                      {breach.severity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-slate-700">Accounts Affected</div>
                      <div className="text-lg font-semibold">
                        {formatNumber(breach.compromisedAccounts)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-700">Data Types Compromised</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {breach.dataTypes.map((type: string, typeIndex: number) => (
                          <Badge key={typeIndex} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Change Passwords Immediately</div>
                <div className="text-sm text-slate-600">
                  Update passwords for all affected accounts. Use unique, strong passwords for each service.
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Enable Two-Factor Authentication</div>
                <div className="text-sm text-slate-600">
                  Add 2FA to all accounts that support it for an extra layer of security.
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Monitor Account Activity</div>
                <div className="text-sm text-slate-600">
                  Keep an eye on your accounts for any suspicious activity and review security settings.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}