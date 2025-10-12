import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Listando usuarios en la base de datos...\n')

  const users = await prisma.user.findMany({
    include: {
      sessions: true,
      subscription: true,
      paymentOrders: true,
    },
  })

  if (users.length === 0) {
    console.log('❌ No hay usuarios en la base de datos')
    return
  }

  users.forEach((user, index) => {
    console.log(`\n${index + 1}. Usuario:`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Nombre: ${user.name || 'N/A'}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Sesiones activas: ${user.sessions.length}`)
    console.log(`   Tiene suscripción: ${user.subscription ? 'Sí' : 'No'}`)
    console.log(`   Órdenes de pago: ${user.paymentOrders.length}`)
    console.log(`   Creado: ${user.createdAt.toLocaleString()}`)
  })

  console.log(`\n✅ Total de usuarios: ${users.length}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
