import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

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

    // Allow both admin and root
    if (decoded.role !== "admin" && decoded.role !== "root") {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

// Verify root token
async function verifyRoot() {
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

    // Only allow root
    if (decoded.role !== "root") {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

// GET single user
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();

  if (!admin) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        subscription: true,
        paymentOrders: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      subscription: user.subscription,
      paymentOrders: user.paymentOrders,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Error al obtener usuario" },
      { status: 500 }
    );
  }
}

// PATCH update user
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();

  if (!admin) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();

    // Don't allow updating certain fields directly
    const { id: _, createdAt, updatedAt, ...updateData } = data;

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Usuario actualizado exitosamente",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Error updating user:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}

// DELETE user (ONLY ROOT)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only root users can delete
  const root = await verifyRoot();

  if (!root) {
    return NextResponse.json(
      { message: "No autorizado - Se requiere permiso de ROOT" },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;

    // Prevent root from deleting themselves
    if (id === root.id) {
      return NextResponse.json(
        { message: "No puedes eliminarte a ti mismo" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Usuario eliminado exitosamente",
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Error al eliminar usuario" },
      { status: 500 }
    );
  }
}
