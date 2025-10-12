import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  const newPassword = process.argv[3]

  if (!email || !newPassword) {
    console.log('Uso: npx tsx scripts/reset-admin-password.ts <email> <nueva-contraseña>')
    console.log('Ejemplo: npx tsx scripts/reset-admin-password.ts admin@example.com MiNuevaContraseña123')
    process.exit(1)
  }

  console.log(`Buscando administrador: ${email}\n`)

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    console.log('❌ Usuario no encontrado')
    process.exit(1)
  }

  if (user.role !== 'admin') {
    console.log('❌ Este usuario no es administrador')
    console.log(`   Rol actual: ${user.role}`)
    console.log('\n   Para convertirlo a admin primero ejecuta:')
    console.log(`   npx tsx scripts/make-admin.ts "${email}"`)
    process.exit(1)
  }

  console.log(`✓ Administrador encontrado:`)
  console.log(`  Nombre: ${user.name}`)
  console.log(`  Email: ${user.email}`)

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12)

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  })

  console.log(`\n✅ Contraseña actualizada exitosamente`)
  console.log(`\nAhora puedes iniciar sesión en /admin/login con:`)
  console.log(`  Email: ${user.email}`)
  console.log(`  Contraseña: ${newPassword}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
