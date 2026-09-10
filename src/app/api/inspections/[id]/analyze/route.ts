import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { extractedFields, demoMode = false } = await request.json()
    // extractedFields is an array of { fieldKey, value, confidence }

    if (params.id.startsWith('demo-')) {
      return NextResponse.json({ success: true, inspection: { id: params.id, status: demoMode ? 'NON_COMPLIANT' : 'COMPLIANT', score: demoMode ? 50 : 100, confidenceScore: 92 } })
    }

    const inspection = await prisma.inspection.findUnique({
      where: { id: params.id },
      include: { product: true } // product might be null if not selected
    })

    if (!inspection) {
      return NextResponse.json({ error: 'Inspection not found' }, { status: 404 })
    }

    // 1. Save extracted fields
    for (const field of extractedFields) {
      await prisma.extractedField.create({
        data: {
          inspectionId: inspection.id,
          fieldKey: field.fieldKey,
          aiValue: field.value,
          confidence: field.confidence
        }
      })
    }

    await prisma.auditLog.create({
      data: {
        inspectionId: inspection.id,
        userId: inspection.inspectorId,
        action: 'OCR_COMPLETED',
        details: JSON.stringify({ message: 'Extracted fields from image.' })
      }
    })

    // 2. Fetch rules and run compliance engine
    const rules = await prisma.complianceRule.findMany()
    let passed = 0;
    let failed = 0;
    let review = 0;

    const extractedMap = extractedFields.reduce((acc: any, curr: any) => {
      acc[curr.fieldKey] = curr;
      return acc;
    }, {});

    for (const rule of rules) {
      let status = 'PASS'
      let explanation = 'Declaration conforms to requirements.'
      const requiredFields: string[] = JSON.parse(rule.requiredFields)
      
      let evidenceField = requiredFields[0]
      let extractedData = extractedMap[evidenceField]

      if (!extractedData || !extractedData.value) {
        status = 'FAIL'
        explanation = `Required declaration (${rule.title}) could not be reliably detected.`
      } else {
        if (extractedData.confidence < 85) {
          status = 'REVIEW'
          explanation = `Low confidence (${Math.round(extractedData.confidence)}%) in extraction. Human review recommended.`
        }
      }
      
      // Artificial failures for demo purposes
      if (demoMode && rule.ruleCode === 'RULE_MRP' && !extractedData?.value) {
        status = 'FAIL'
        explanation = 'MRP is missing or illegible.'
      }

      if (status === 'PASS') passed++;
      if (status === 'FAIL') failed++;
      if (status === 'REVIEW') review++;

      await prisma.complianceResult.create({
        data: {
          inspectionId: inspection.id,
          ruleId: rule.id,
          status,
          explanation,
          evidenceField,
          confidence: extractedData?.confidence || 0
        }
      })
    }

    // 3. Determine Overall Status & Score
    let overallStatus = 'COMPLIANT'
    if (failed > 0) overallStatus = 'NON_COMPLIANT'
    else if (review > 0) overallStatus = 'REQUIRES_REVIEW'

    const totalRules = rules.length
    const score = totalRules > 0 ? ((passed / totalRules) * 100) : 0

    // Average confidence
    const avgConfidence = extractedFields.length > 0 
      ? extractedFields.reduce((acc: number, curr: any) => acc + curr.confidence, 0) / extractedFields.length 
      : 0;

    const updatedInspection = await prisma.inspection.update({
      where: { id: inspection.id },
      data: {
        status: overallStatus,
        score: Math.round(score),
        confidenceScore: Math.round(avgConfidence)
      }
    })

    await prisma.auditLog.create({
      data: {
        inspectionId: inspection.id,
        userId: inspection.inspectorId,
        action: 'RULE_EVALUATED',
        details: JSON.stringify({ message: 'Compliance engine executed.', score: Math.round(score) })
      }
    })

    return NextResponse.json({ success: true, inspection: updatedInspection })

  } catch (error) {
    console.error('Error analyzing inspection:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
