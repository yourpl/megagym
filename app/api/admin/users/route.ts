import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { hash } from "bcryptjs";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "admin-secret-key";

// Verify admin token
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    };

    if (decoded.role !== "admin" && decoded.role !== "root") {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

// GET all users
export async function GET(request: Request) {
  const admin = await verifyAdmin();

  if (!admin) {
    return NextResponse.json(
      { message: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          role: true,
          subscription: true,
          paymentOrders: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: {
            select: {
              paymentOrders: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        createdAt: user.createdAt,
        subscription: user.subscription,
        lastPayment: user.paymentOrders[0] || null,
        totalOrders: user._count.paymentOrders,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: Request) {
  const admin = await verifyAdmin();

  if (!admin) {
    return NextResponse.json(
      { message: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const { name, email, password, sex, age, role } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !sex || !age) {
      return NextResponse.json(
        { message: "Nombre, email, contraseña, sexo y edad son requeridos" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Email inválido" },
        { status: 400 }
      );
    }

    // Validate sex
    const validSexes = ["male", "female", "other"];
    if (!validSexes.includes(sex)) {
      return NextResponse.json(
        { message: "Sexo inválido" },
        { status: 400 }
      );
    }

    // Validate age
    const ageNumber = parseInt(age);
    if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 120) {
      return NextResponse.json(
        { message: "Edad inválida (debe estar entre 1 y 120)" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["user", "admin", "root"];
    const userRoleName = role || "user";
    if (!validRoles.includes(userRoleName)) {
      return NextResponse.json(
        { message: "Rol inválido" },
        { status: 400 }
      );
    }

    // Get role ID
    const roleRecord = await prisma.role.findUnique({
      where: { name: userRoleName },
    });

    if (!roleRecord) {
      return NextResponse.json(
        { message: "Rol no encontrado en la base de datos" },
        { status: 500 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "El email ya está registrado" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        sex,
        age: ageNumber,
        roleId: roleRecord.id,
      },
      include: {
        role: true,
      },
    });

    return NextResponse.json(
      {
        message: "Usuario creado exitosamente",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role.name,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Error al crear usuario" },
      { status: 500 }
    );
  }
}
