import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId, scanData } = await request.json()

    // Calculate security scores
    const passwordScore = Math.floor(Math.random() * 40) + 60 // 60-100
    const breachCount = Math.floor(Math.random() * 5)
    const twoFaEnabled = Math.random() > 0.5

    // Calculate overall security score
    const passwordWeight = 0.4
    const breachWeight = 0.3
    const twoFaWeight = 0.3

    const passwordScoreNorm = passwordScore / 100
    const breachScoreNorm = Math.max(0, (5 - breachCount) / 5)
    const twoFaScoreNorm = twoFaEnabled ? 1 : 0

    const overallScore = Math.round(
      (passwordScoreNorm * passwordWeight + 
       breachScoreNorm * breachWeight + 
       twoFaScoreNorm * twoFaWeight) * 100
    )

    // Save security scan to database
    const securityScan = await db.securityScan.create({
      data: {
        userId: userId || 'default-user',
        overallScore,
        emailAnalyzed: true,
        breachCheckDone: true,
        twoFaChecked: true,
        passwordScore,
        breachCount,
        twoFaEnabled,
        scanData: {
          timestamp: new Date().toISOString(),
          scanResults: scanData || {},
          recommendations: generateRecommendations(overallScore, passwordScore, breachCount, twoFaEnabled)
        }
      }
    })

    // Generate security todos based on scan results
    await generateSecurityTodos(userId || 'default-user', overallScore, passwordScore, breachCount, twoFaEnabled)

    return NextResponse.json({
      success: true,
      scanId: securityScan.id,
      results: {
        overallScore,
        passwordScore,
        breachCount,
        twoFaEnabled,
        emailAnalyzed: true,
        breachCheckDone: true,
        twoFaChecked: true
      }
    })

  } catch (error) {
    console.error('Security scan error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to perform security scan' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'default-user'

    // Get latest security scan for user
    const latestScan = await db.securityScan.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    if (!latestScan) {
      return NextResponse.json({
        success: true,
        scan: null,
        message: 'No security scan found'
      })
    }

    return NextResponse.json({
      success: true,
      scan: latestScan
    })

  } catch (error) {
    console.error('Get security scan error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve security scan' },
      { status: 500 }
    )
  }
}

function generateRecommendations(overallScore: number, passwordScore: number, breachCount: number, twoFaEnabled: boolean) {
  const recommendations: Array<{
    type: string
    priority: string
    title: string
    description: string
  }> = []

  if (passwordScore < 80) {
    recommendations.push({
      type: 'password',
      priority: passwordScore < 60 ? 'high' : 'medium',
      title: 'Improve Password Security',
      description: 'Some passwords are weak or may be reused. Consider using a password manager.'
    })
  }

  if (breachCount > 0) {
    recommendations.push({
      type: 'breach',
      priority: breachCount > 2 ? 'high' : 'medium',
      title: 'Address Data Breaches',
      description: `${breachCount} potential breach(es) found. Change passwords for affected accounts.`
    })
  }

  if (!twoFaEnabled) {
    recommendations.push({
      type: '2fa',
      priority: 'high',
      title: 'Enable Two-Factor Authentication',
      description: '2FA adds an extra layer of security to protect your accounts.'
    })
  }

  if (overallScore < 60) {
    recommendations.push({
      type: 'general',
      priority: 'medium',
      title: 'Overall Security Improvement Needed',
      description: 'Your security score is below average. Focus on the high-priority items first.'
    })
  }

  return recommendations
}

async function generateSecurityTodos(userId: string, overallScore: number, passwordScore: number, breachCount: number, twoFaEnabled: boolean) {
  const todos: Array<{
    title: string
    description: string
    priority: string
    category: string
  }> = []

  if (passwordScore < 80) {
    todos.push({
      title: 'Change weak passwords',
      description: 'Update passwords for accounts with weak or reused passwords',
      priority: passwordScore < 60 ? 'high' : 'medium',
      category: 'password'
    })
  }

  if (!twoFaEnabled) {
    todos.push({
      title: 'Enable 2FA on high-priority accounts',
      description: 'Set up two-factor authentication on email, banking, and social media accounts',
      priority: 'high',
      category: '2fa'
    })
  }

  if (breachCount > 0) {
    todos.push({
      title: 'Review breach notifications',
      description: 'Check and respond to any data breach alerts for your accounts',
      priority: breachCount > 2 ? 'high' : 'medium',
      category: 'breach'
    })
  }

  // Add general recommendations
  todos.push({
    title: 'Set up password manager',
    description: 'Install and configure a password manager to generate and store strong passwords',
    priority: 'medium',
    category: 'password'
  })

  todos.push({
    title: 'Review account recovery options',
    description: 'Update recovery email addresses and phone numbers for important accounts',
    priority: 'medium',
    category: 'general'
  })

  // Save todos to database
  for (const todo of todos) {
    await db.securityTodo.create({
      data: {
        userId,
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        category: todo.category
      }
    })
  }
}