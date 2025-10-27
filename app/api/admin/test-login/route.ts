import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const email = "firewolfyt814@gmail.com";
    const testPassword = "Admin123456";

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" });
    }

    const isPasswordValid = user.password
      ? await bcrypt.compare(testPassword, user.password)
      : false;

    return NextResponse.json({
      userFound: true,
      email: user.email,
      role: user.role.name,
      hasPassword: !!user.password,
      passwordValid: isPasswordValid,
      isAdmin: user.role.name === "admin",
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    });
  }
}
