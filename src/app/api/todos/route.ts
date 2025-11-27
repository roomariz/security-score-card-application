import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'default-user'

    const todos = await db.securityTodo.findMany({
      where: { userId },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      todos
    })

  } catch (error) {
    console.error('Get todos error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve todos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, title, description, priority, category } = await request.json()

    const todo = await db.securityTodo.create({
      data: {
        userId: userId || 'default-user',
        title,
        description,
        priority: priority || 'medium',
        category: category || 'general'
      }
    })

    return NextResponse.json({
      success: true,
      todo
    })

  } catch (error) {
    console.error('Create todo error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create todo' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { todoId, completed } = await request.json()

    const todo = await db.securityTodo.update({
      where: { id: todoId },
      data: { completed }
    })

    return NextResponse.json({
      success: true,
      todo
    })

  } catch (error) {
    console.error('Update todo error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update todo' },
      { status: 500 }
    )
  }
}