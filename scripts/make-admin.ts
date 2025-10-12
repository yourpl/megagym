import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const emailOrName = process.argv[2]

  if (!emailOrName) {
    console.log('Uso: npx tsx scripts/make-admin.ts <email-o-nombre>')
    console.log('Ejemplo: npx tsx scripts/make-admin.ts "kevin narvaez"')
    process.exit(1)
  }

  console.log(`Buscando usuario: ${emailOrName}\n`)

  // Search by email or name
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: emailOrName },
        { email: { contains: emailOrName, mode: 'insensitive' } },
        { name: { contains: emailOrName, mode: 'insensitive' } },
      ],
    },
  })

  if (!user) {
    console.log('❌ Usuario no encontrado')
    console.log('\nUsuarios disponibles:')
    const allUsers = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    })
    allUsers.forEach((u) => {
      console.log(`  - ${u.name || 'Sin nombre'} (${u.email}) - Rol: ${u.role}`)
    })
    process.exit(1)
  }

  console.log(`✓ Usuario encontrado:`)
  console.log(`  ID: ${user.id}`)
  console.log(`  Nombre: ${user.name}`)
  console.log(`  Email: ${user.email}`)
  console.log(`  Rol actual: ${user.role}`)

  if (user.role === 'admin') {
    console.log('\n⚠️  Este usuario ya es administrador')
    process.exit(0)
  }

  // Update to admin
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { role: 'admin' },
  })

  console.log(`\n✅ Usuario actualizado a administrador`)
  console.log(`  Nuevo rol: ${updatedUser.role}`)
  console.log(`\nAhora puedes iniciar sesión en /admin/login con:`)
  console.log(`  Email: ${updatedUser.email}`)
  console.log(`  Contraseña: (la que registraste)`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
