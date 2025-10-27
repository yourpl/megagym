import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed de la base de datos...");

  // Crear roles
  const roles = [
    {
      name: "user",
      description: "Usuario regular del gimnasio",
    },
    {
      name: "admin",
      description: "Administrador con acceso al panel de administración",
    },
    {
      name: "root",
      description: "Super administrador con permisos completos",
    },
  ];

  console.log("Creando roles...");
  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
    console.log(`✓ Rol creado/actualizado: ${role.name}`);
  }

  console.log("\n✅ Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
