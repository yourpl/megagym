import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Eliminando todos los usuarios...')

  // Delete all related records first
  await prisma.paymentOrder.deleteMany({})
  console.log('✓ Órdenes de pago eliminadas')

  await prisma.subscription.deleteMany({})
  console.log('✓ Suscripciones eliminadas')

  await prisma.session.deleteMany({})
  console.log('✓ Sesiones eliminadas')

  await prisma.account.deleteMany({})
  console.log('✓ Cuentas eliminadas')

  await prisma.user.deleteMany({})
  console.log('✓ Usuarios eliminados')

  console.log('\n✅ Todos los usuarios han sido eliminados de la base de datos')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
