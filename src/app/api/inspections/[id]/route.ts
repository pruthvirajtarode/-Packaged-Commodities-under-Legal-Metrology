import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const inspection = await prisma.inspection.findUnique({
      where: { id: params.id },
      include: {
        inspector: true,
        product: true,
        images: true,
        extractedData: true,
        results: { include: { rule: true } },
        auditLogs: { orderBy: { timestamp: 'desc' }, include: { user: { select: { name: true } } } },
      }
    })

    if (!inspection) {
      return NextResponse.json({ error: 'Inspection not found' }, { status: 404 })
    }

    return NextResponse.json(inspection)
  } catch (error) {
    console.error('Error fetching inspection:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
