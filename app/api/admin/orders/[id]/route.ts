import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

// DELETE - Delete order (ROOT only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  // Only ROOT users can delete orders
  if (admin.role !== "root") {
    return NextResponse.json(
      { message: "Se requiere permiso de ROOT para eliminar órdenes" },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;

    // Check if order exists
    const order = await prisma.paymentOrder.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Orden no encontrada" },
        { status: 404 }
      );
    }

    // Delete order
    await prisma.paymentOrder.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Orden eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { message: "Error al eliminar la orden" },
      { status: 500 }
    );
  }
}
