import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    if (params.id.startsWith('demo-')) {
      return NextResponse.json({
        id: params.id,
        inspectorId: 'demo-inspector',
        productId: 'demo-product',
        status: 'COMPLIANT',
        score: 100,
        confidenceScore: 95,
        createdAt: new Date().toISOString(),
        inspector: { name: 'Nandini Tarode (Inspector)', email: 'inspector@packsure.ai' },
        product: { name: 'Demo Product Label', category: 'Testing' },
        images: [{ url: 'https://via.placeholder.com/400', type: 'FRONT' }],
        extractedData: [
          { fieldKey: 'mrp', aiValue: '50.00', confidence: 99 },
          { fieldKey: 'netQuantity', aiValue: '200g', confidence: 98 }
        ],
        results: [
          { status: 'PASS', rule: { title: 'Maximum Retail Price (MRP)' }, explanation: 'Found clearly.' },
          { status: 'PASS', rule: { title: 'Net Quantity Declaration' }, explanation: 'Found clearly.' }
        ],
        auditLogs: []
      })
    }

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
