import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'firewolfyt814@gmail.com'

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    console.log('❌ Usuario no encontrado')
    return
  }

  console.log('Usuario encontrado:')
  console.log('  ID:', user.id)
  console.log('  Nombre:', user.name)
  console.log('  Email:', user.email)
  console.log('  Rol:', user.role)
  console.log('  Tiene contraseña:', user.password ? 'Sí (hash: ' + user.password.substring(0, 20) + '...)' : 'No')
  console.log('  Email verificado:', user.emailVerified ? 'Sí' : 'No')
  console.log('  Creado:', user.createdAt)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
