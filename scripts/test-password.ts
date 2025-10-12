import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'firewolfyt814@gmail.com'
  const testPassword = 'Admin123456'

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !user.password) {
    console.log('❌ Usuario no encontrado o sin contraseña')
    return
  }

  console.log('Usuario:', user.email)
  console.log('Rol:', user.role)
  console.log('Hash almacenado:', user.password.substring(0, 30) + '...')
  console.log('\nProbando contraseña:', testPassword)

  const isValid = await bcrypt.compare(testPassword, user.password)
  console.log('¿Contraseña válida?:', isValid ? '✅ SÍ' : '❌ NO')

  // También probemos con la contraseña original que usaste al registrarte
  console.log('\n¿Recuerdas la contraseña original que usaste al registrarte?')
  console.log('Prueba con esa contraseña en el login normal de /auth/signin')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
