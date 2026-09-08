import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { fieldId, humanValue, reviewerId } = await request.json()

    const field = await prisma.extractedField.update({
      where: { id: fieldId },
      data: {
        humanValue,
        isCorrected: true
      }
    })

    // Add to audit trail
    await prisma.auditLog.create({
      data: {
        inspectionId: params.id,
        userId: reviewerId,
        action: 'HUMAN_VERIFIED',
        details: JSON.stringify({ field: field.fieldKey, newValue: humanValue })
      }
    })

    // Note: Re-running compliance rules based on updated field would happen here

    return NextResponse.json(field)
  } catch (error) {
    console.error('Error updating field:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
