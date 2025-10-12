import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { reason } = await request.json();

    // Get the order
    const order = await prisma.paymentOrder.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Orden no encontrada" },
        { status: 404 }
      );
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        { message: "Solo se pueden rechazar órdenes pendientes" },
        { status: 400 }
      );
    }

    // Update order status
    await prisma.paymentOrder.update({
      where: { id },
      data: {
        status: "rejected",
        reviewedBy: admin.email,
        reviewedAt: new Date(),
        notes: reason ? `Rechazada: ${reason}` : "Rechazada por el administrador",
      },
    });

    return NextResponse.json({
      message: "Orden rechazada exitosamente",
    });
  } catch (error) {
    console.error("Error rejecting order:", error);
    return NextResponse.json(
      { message: "Error al rechazar la orden" },
      { status: 500 }
    );
  }
}
