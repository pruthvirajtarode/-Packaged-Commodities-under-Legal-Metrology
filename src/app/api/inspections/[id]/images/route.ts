import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { url, type } = await request.json()
    
    if (params.id.startsWith('demo-')) {
      return NextResponse.json({ id: 'demo-img-1', inspectionId: params.id, url, type: type || 'FRONT' }, { status: 201 })
    }

    const image = await prisma.inspectionImage.create({
      data: {
        inspectionId: params.id,
        url,
        type: type || 'FRONT'
      }
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
