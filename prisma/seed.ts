import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  // 1. Seed Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@packsure.ai' },
    update: {},
    create: {
      email: 'admin@packsure.ai',
      name: 'Admin User',
      role: 'ADMIN',
    },
  })
  
  const inspector = await prisma.user.upsert({
    where: { email: 'inspector@packsure.ai' },
    update: {},
    create: {
      email: 'inspector@packsure.ai',
      name: 'Ramesh Kumar (Inspector)',
      role: 'INSPECTOR',
    },
  })

  // 2. Seed Compliance Rules
  const rules = [
    {
      ruleCode: 'RULE_NET_QTY',
      title: 'Net Quantity Declaration',
      description: 'The net quantity of the commodity should be declared clearly.',
      category: 'Mandatory Declaration',
      applicability: 'ALL',
      requiredFields: JSON.stringify(['netQuantity']),
      validationLogic: 'Required',
      severity: 'CRITICAL',
      source: 'Legal Metrology (Packaged Commodities) Rules, 2011',
      sourceVersion: '2011',
    },
    {
      ruleCode: 'RULE_MRP',
      title: 'Maximum Retail Price (MRP)',
      description: 'MRP should be explicitly declared inclusive of all taxes.',
      category: 'Pricing',
      applicability: 'ALL',
      requiredFields: JSON.stringify(['mrp']),
      validationLogic: 'Required',
      severity: 'CRITICAL',
      source: 'Legal Metrology (Packaged Commodities) Rules, 2011',
      sourceVersion: '2011',
    },
    {
      ruleCode: 'RULE_MFG_DETAILS',
      title: 'Manufacturer / Packer Details',
      description: 'Name and complete address of the manufacturer, packer or importer is required.',
      category: 'Origin & Manufacturer',
      applicability: 'ALL',
      requiredFields: JSON.stringify(['manufacturer']),
      validationLogic: 'Required',
      severity: 'HIGH',
      source: 'Legal Metrology (Packaged Commodities) Rules, 2011',
      sourceVersion: '2011',
    },
    {
      ruleCode: 'RULE_CUSTOMER_CARE',
      title: 'Consumer Care Information',
      description: 'Contact details for consumer complaints (address, telephone, email).',
      category: 'Consumer Information',
      applicability: 'ALL',
      requiredFields: JSON.stringify(['customerCare']),
      validationLogic: 'Required',
      severity: 'HIGH',
      source: 'Legal Metrology (Packaged Commodities) Rules, 2011',
      sourceVersion: '2011',
    }
  ]

  for (const r of rules) {
    await prisma.complianceRule.upsert({
      where: { ruleCode: r.ruleCode },
      update: {},
      create: r,
    })
  }

  // 3. Seed Products
  const products = [
    {
      name: 'Aarav Premium Basmati Rice',
      category: 'Food Grains',
      manufacturer: 'Aarav Foods Pvt. Ltd.',
      mrp: 699,
      netQuantity: '5 kg',
      barcode: '8901234567890'
    },
    {
      name: 'Bharat Essentials Dishwash Liquid',
      category: 'Homecare',
      manufacturer: 'Bharat Essentials',
      mrp: 149,
      netQuantity: '500 ml',
      barcode: '8909876543210'
    }
  ]
  
  for (const p of products) {
    await prisma.product.create({
      data: p
    })
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
