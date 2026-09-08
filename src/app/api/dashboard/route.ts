import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const totalInspections = await prisma.inspection.count()
    
    const compliant = await prisma.inspection.count({ where: { status: 'COMPLIANT' } })
    const nonCompliant = await prisma.inspection.count({ where: { status: 'NON_COMPLIANT' } })
    const requiresReview = await prisma.inspection.count({ where: { status: 'REQUIRES_REVIEW' } })

    // Recent inspections
    const recent = await prisma.inspection.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { name: true, category: true } }
      }
    })

    return NextResponse.json({
      stats: {
        totalInspections,
        compliant,
        nonCompliant,
        requiresReview
      },
      recent
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
