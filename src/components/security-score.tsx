'use client'

import { Progress } from '@/components/ui/progress'
import { Shield, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SecurityScoreProps {
  score: number
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
}

export function SecurityScore({ score, size = 'medium', showLabel = true }: SecurityScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getIcon = (score: number) => {
    const iconClass = cn('h-6 w-6', getScoreColor(score))
    
    if (score >= 80) return <ShieldCheck className={iconClass} />
    if (score >= 60) return <ShieldAlert className={iconClass} />
    return <ShieldX className={iconClass} />
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-16 h-16'
      case 'large':
        return 'w-32 h-32'
      default:
        return 'w-24 h-24'
    }
  }

  const getScoreSize = () => {
    switch (size) {
      case 'small':
        return 'text-lg font-bold'
      case 'large':
        return 'text-4xl font-bold'
      default:
        return 'text-2xl font-bold'
    }
  }

  if (score === 0) {
    return (
      <div className={cn('flex items-center justify-center', getSizeClasses())}>
        <Shield className="h-8 w-8 text-slate-400" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={cn('relative flex items-center justify-center', getSizeClasses())}>
        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
        <Progress 
          value={score} 
          className="absolute inset-0 rounded-full border-4 border-slate-200 [&>div]:rounded-full"
          style={{
            background: `conic-gradient(${getScoreColor(score)} ${score * 3.6}deg, #e2e8f0 0deg)`
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center bg-white rounded-full">
          {getIcon(score)}
          {showLabel && (
            <div className={cn('mt-1', getScoreSize(), getScoreColor(score))}>
              {score}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}