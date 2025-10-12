import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

// DELETE - Delete subscription (ROOT only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  // Only ROOT users can delete subscriptions
  if (admin.role !== "root") {
    return NextResponse.json(
      { message: "Se requiere permiso de ROOT para eliminar suscripciones" },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;

    // Check if subscription exists
    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      return NextResponse.json(
        { message: "Suscripción no encontrada" },
        { status: 404 }
      );
    }

    // Delete subscription
    await prisma.subscription.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Suscripción eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { message: "Error al eliminar la suscripción" },
      { status: 500 }
    );
  }
}
