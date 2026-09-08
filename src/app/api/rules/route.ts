import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const rules = await prisma.complianceRule.findMany({
      orderBy: { title: 'asc' }
    })

    return NextResponse.json(rules)
  } catch (error) {
    console.error('Error fetching rules:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
