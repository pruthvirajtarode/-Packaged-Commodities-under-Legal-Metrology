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
        inspector: { name: 'Nandini Tarode (Inspector)', email: 'inspector@scansure.ai' },
        product: { name: 'Demo Product Label', category: 'Testing' },
        images: [{ url: '/sample_label.png', type: 'FRONT' }],
        extractedData: [
          { id: 'ext-1', fieldKey: 'mrp', aiValue: '50.00', confidence: 99 },
          { id: 'ext-2', fieldKey: 'netQuantity', aiValue: '200g', confidence: 98 }
        ],
        results: [
          { id: 'res-1', status: 'PASS', rule: { title: 'Maximum Retail Price (MRP)', ruleCode: 'RULE-001' }, explanation: 'Found clearly.', evidenceField: 'mrp', confidence: 99 },
          { id: 'res-2', status: 'PASS', rule: { title: 'Net Quantity Declaration', ruleCode: 'RULE-002' }, explanation: 'Found clearly.', evidenceField: 'netQuantity', confidence: 98 }
        ],
        auditLogs: [
          { id: 'log-1', action: 'CREATED', timestamp: new Date(Date.now() - 5000).toISOString(), user: { name: 'System' }, details: JSON.stringify({ message: 'Inspection created via web interface.' }) },
          { id: 'log-2', action: 'ANALYSIS_COMPLETED', timestamp: new Date(Date.now() - 1000).toISOString(), user: { name: 'System' }, details: JSON.stringify({ message: 'AI processing completed successfully.' }) }
        ]
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
