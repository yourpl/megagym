import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "admin-secret-key";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Find admin user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    console.log('Login attempt:', { email, userFound: !!user, role: user?.role.name });

    if (!user || (user.role.name !== "admin" && user.role.name !== "root")) {
      console.log('Failed: User not found or not admin/root');
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Verify password
    if (!user.password) {
      console.log('Failed: User has no password');
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation:', { isPasswordValid });

    if (!isPasswordValid) {
      console.log('Failed: Invalid password');
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    const response = NextResponse.json({
      message: "Login exitoso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    });

    // Set cookie
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Error logging in admin:", error);
    return NextResponse.json(
      {
        message: "Error al iniciar sesión",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
