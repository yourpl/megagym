import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Ejecutar una query SQL directa para ver la estructura de la tabla
  const result = await prisma.$queryRaw`
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_name = 'User'
    ORDER BY ordinal_position;
  ` as any[]

  console.log('Estructura de la tabla User:\n')
  result.forEach((col) => {
    console.log(`  ${col.column_name}: ${col.data_type} (default: ${col.column_default || 'null'})`)
  })

  console.log('\n\nValor de role para firewolfyt814@gmail.com:')
  const user = await prisma.$queryRaw`
    SELECT id, name, email, role
    FROM "User"
    WHERE email = 'firewolfyt814@gmail.com';
  ` as any[]

  if (user.length > 0) {
    console.log('  Role:', user[0].role)
    console.log('  Full user:', user[0])
  } else {
    console.log('  Usuario no encontrado')
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
