import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50

    const inspections = await prisma.inspection.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        inspector: { select: { name: true, email: true } },
        product: { select: { name: true, category: true } },
      }
    })

    return NextResponse.json(inspections)
  } catch (error) {
    console.error('Error fetching inspections:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // In a real app, inspectorId comes from the session
    // For demo, we get the first inspector
    const inspector = await prisma.user.findFirst({ where: { role: 'INSPECTOR' } })
    
    if (!inspector) {
      return NextResponse.json({ error: 'No inspector found in DB for demo.' }, { status: 400 })
    }

    const inspection = await prisma.inspection.create({
      data: {
        inspectorId: inspector.id,
        productId: body.productId || null,
        status: 'PENDING',
      }
    })

    await prisma.auditLog.create({
      data: {
        inspectionId: inspection.id,
        userId: inspector.id,
        action: 'CREATED',
        details: JSON.stringify({ message: 'Inspection created via web interface.' })
      }
    })

    return NextResponse.json(inspection, { status: 201 })
  } catch (error) {
    console.error('Error creating inspection:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
