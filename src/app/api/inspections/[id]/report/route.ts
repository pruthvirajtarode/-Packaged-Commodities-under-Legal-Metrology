import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const inspection = await prisma.inspection.findUnique({
      where: { id: params.id },
      include: {
        product: true,
        inspector: true,
        results: { include: { rule: true } }
      }
    })

    if (!inspection) return new NextResponse('Not found', { status: 404 })

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4 size
    const { width, height } = page.getSize()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    page.drawText('ScanSure AI - Compliance Report', { x: 50, y: height - 50, size: 20, font: boldFont })
    
    page.drawText(`Inspection ID: ${inspection.id.slice(0, 8)}`, { x: 50, y: height - 80, size: 12, font })
    page.drawText(`Date: ${new Date(inspection.createdAt).toLocaleString()}`, { x: 50, y: height - 100, size: 12, font })
    page.drawText(`Product: ${inspection.product?.name || 'N/A'}`, { x: 50, y: height - 120, size: 12, font })
    
    const statusColor = inspection.status === 'COMPLIANT' ? rgb(0, 0.8, 0) : 
                        inspection.status === 'NON_COMPLIANT' ? rgb(0.8, 0, 0) : rgb(0.8, 0.4, 0);
                        
    page.drawText(`Status: ${inspection.status}`, { x: 50, y: height - 140, size: 14, font: boldFont, color: statusColor })

    page.drawText('Rule Evaluations:', { x: 50, y: height - 180, size: 16, font: boldFont })
    
    let y = height - 210
    for (const res of inspection.results) {
      page.drawText(`${res.rule.title} [${res.status}]`, { x: 50, y, size: 12, font: boldFont })
      y -= 15
      page.drawText(`Evidence: ${res.explanation}`, { x: 60, y, size: 10, font })
      y -= 25
      if (y < 50) {
        // Add new page logic here if needed for real app
      }
    }

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ScanSure_Report_${inspection.id.slice(0,8)}.pdf"`
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
