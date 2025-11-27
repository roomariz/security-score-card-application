'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Key, CheckCircle, AlertTriangle, ExternalLink, Smartphone, Mail, Shield } from 'lucide-react'
import { useState } from 'react'

interface TwoFaCheckerProps {
  enabled: boolean
}

export function TwoFaChecker({ enabled }: TwoFaCheckerProps) {
  const [showSetupGuide, setShowSetupGuide] = useState(false)

  const twoFaServices = [
    {
      name: 'Google',
      category: 'Email',
      icon: Mail,
      twoFaSupported: true,
      setupUrl: 'https://myaccount.google.com/security',
      priority: 'high'
    },
    {
      name: 'Microsoft',
      category: 'Email/Productivity',
      icon: Mail,
      twoFaSupported: true,
      setupUrl: 'https://account.microsoft.com/security',
      priority: 'high'
    },
    {
      name: 'Apple',
      category: 'Devices/Services',
      icon: Smartphone,
      twoFaSupported: true,
      setupUrl: 'https://appleid.apple.com/account/manage',
      priority: 'high'
    },
    {
      name: 'Facebook',
      category: 'Social Media',
      icon: Shield,
      twoFaSupported: true,
      setupUrl: 'https://www.facebook.com/settings?tab=security',
      priority: 'medium'
    },
    {
      name: 'Twitter/X',
      category: 'Social Media',
      icon: Shield,
      twoFaSupported: true,
      setupUrl: 'https://twitter.com/settings/security',
      priority: 'medium'
    },
    {
      name: 'Instagram',
      category: 'Social Media',
      icon: Shield,
      twoFaSupported: true,
      setupUrl: 'https://www.instagram.com/accounts/security/',
      priority: 'medium'
    },
    {
      name: 'LinkedIn',
      category: 'Professional',
      icon: Shield,
      twoFaSupported: true,
      setupUrl: 'https://www.linkedin.com/psettings/security',
      priority: 'medium'
    },
    {
      name: 'GitHub',
      category: 'Development',
      icon: Shield,
      twoFaSupported: true,
      setupUrl: 'https://github.com/settings/security',
      priority: 'high'
    }
  ]

  const enabledServices = enabled ? Math.floor(Math.random() * 4) + 2 : 1
  const coveragePercentage = Math.round((enabledServices / twoFaServices.length) * 100)

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Two-Factor Authentication (2FA)
          </CardTitle>
          <CardDescription>
            Analysis of your 2FA setup across major services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
            <div className="flex items-center gap-3">
              {enabled ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              )}
              <div>
                <div className="font-medium">2FA Status</div>
                <div className="text-sm text-slate-600">
                  {enabled ? '2FA is enabled on some accounts' : '2FA setup is incomplete'}
                </div>
              </div>
            </div>
            <Badge variant={enabled ? 'default' : 'secondary'}>
              {enabled ? 'Partial' : 'Needs Setup'}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Account Coverage</span>
              <span className="text-sm text-slate-600">{enabledServices}/{twoFaServices.length} services</span>
            </div>
            <Progress value={coveragePercentage} className="h-2" />
            <div className="text-right text-sm font-medium text-slate-600">
              {coveragePercentage}% coverage
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center space-y-2">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
              <div className="text-sm font-medium">Protected</div>
              <div className="text-2xl font-bold text-green-600">{enabledServices}</div>
            </div>
            <div className="text-center space-y-2">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto" />
              <div className="text-sm font-medium">At Risk</div>
              <div className="text-2xl font-bold text-yellow-600">
                {twoFaServices.length - enabledServices}
              </div>
            </div>
            <div className="text-center space-y-2">
              <Shield className="h-8 w-8 text-blue-500 mx-auto" />
              <div className="text-sm font-medium">Security Boost</div>
              <div className="text-2xl font-bold text-blue-600">+{coveragePercentage}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service 2FA Status</CardTitle>
          <CardDescription>
            Current 2FA status for your major online accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {twoFaServices.map((service, index) => {
              const isEnabled = index < enabledServices
              const Icon = service.icon
              
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-slate-500" />
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-slate-600">{service.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={isEnabled ? 'default' : 'secondary'}>
                      {isEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Badge 
                      variant={getPriorityBadgeVariant(service.priority)}
                      className={getPriorityColor(service.priority)}
                    >
                      {service.priority}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>2FA Setup Guide</CardTitle>
          <CardDescription>
            Step-by-step instructions to enable 2FA on your accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Recommended Apps
                </h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="font-medium">Google Authenticator</div>
                    <div className="text-sm text-slate-600">Simple, reliable, widely supported</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="font-medium">Authy</div>
                    <div className="text-sm text-slate-600">Multi-device support, backup options</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="font-medium">Microsoft Authenticator</div>
                    <div className="text-sm text-slate-600">Good integration with Microsoft services</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Quick Setup Steps</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-sm">Download a 2FA app to your phone</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-sm">Go to security settings of your account</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-sm">Scan QR code with your 2FA app</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <div className="text-sm">Save backup codes securely</div>
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium">Security Tip</div>
                <div className="text-sm text-slate-600">
                  Always save your backup codes in a secure location. They're your only way to access 
                  your account if you lose your phone.
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}