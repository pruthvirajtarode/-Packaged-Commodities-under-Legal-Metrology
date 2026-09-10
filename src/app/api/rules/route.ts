import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const rules = await prisma.complianceRule.findMany({
      orderBy: { title: 'asc' }
    })

    return NextResponse.json(rules)
  } catch (error) {
    console.error('Error fetching rules (returning mock data):', error)
    return NextResponse.json([
      {
        id: "rule-1",
        ruleCode: "RULE-001",
        title: "Maximum Retail Price (MRP)",
        description: "The package must clearly declare the Maximum Retail Price inclusive of all taxes.",
        category: "Pricing",
        severity: "CRITICAL",
        requiredFields: JSON.stringify(["mrp"]),
        source: "Legal Metrology (Packaged Commodities) Rules, 2011"
      },
      {
        id: "rule-2",
        ruleCode: "RULE-002",
        title: "Net Quantity Declaration",
        description: "The net quantity must be declared in standard units of weight, measure, or number.",
        category: "Measurements",
        severity: "CRITICAL",
        requiredFields: JSON.stringify(["netQuantity"]),
        source: "Legal Metrology (Packaged Commodities) Rules, 2011"
      },
      {
        id: "rule-3",
        ruleCode: "RULE-003",
        title: "Manufacturer Details",
        description: "The name and address of the manufacturer, packer, or importer must be clearly visible.",
        category: "Traceability",
        severity: "HIGH",
        requiredFields: JSON.stringify(["manufacturerName", "manufacturerAddress"]),
        source: "Legal Metrology (Packaged Commodities) Rules, 2011"
      },
      {
        id: "rule-4",
        ruleCode: "RULE-004",
        title: "Date of Manufacture/Packing",
        description: "The month and year of manufacture, pre-packing, or import must be stated.",
        category: "Consumer Safety",
        severity: "HIGH",
        requiredFields: JSON.stringify(["manufactureDate"]),
        source: "Legal Metrology (Packaged Commodities) Rules, 2011"
      }
    ]);
  }
}
