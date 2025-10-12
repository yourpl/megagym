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
        { message: "Solo se pueden aprobar órdenes pendientes" },
        { status: 400 }
      );
    }

    // Calculate subscription dates based on plan
    const now = new Date();
    const endDate = new Date(now);

    switch (order.plan) {
      case "diario":
        endDate.setDate(endDate.getDate() + 1);
        break;
      case "semanal":
        endDate.setDate(endDate.getDate() + 7);
        break;
      case "quincenal":
        endDate.setDate(endDate.getDate() + 15);
        break;
      case "mensual":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      default:
        return NextResponse.json(
          { message: "Plan inválido" },
          { status: 400 }
        );
    }

    // Update order and create/update subscription in a transaction
    await prisma.$transaction(async (tx) => {
      // Update order status
      await tx.paymentOrder.update({
        where: { id },
        data: {
          status: "approved",
          reviewedBy: admin.email,
          reviewedAt: new Date(),
        },
      });

      // Check if user already has a subscription
      const existingSubscription = await tx.subscription.findUnique({
        where: { userId: order.userId },
      });

      if (existingSubscription) {
        // Extend existing subscription
        const currentEndDate = new Date(existingSubscription.endDate);
        const isActive = currentEndDate > now;

        const newEndDate = new Date(
          isActive ? currentEndDate : now
        );

        switch (order.plan) {
          case "diario":
            newEndDate.setDate(newEndDate.getDate() + 1);
            break;
          case "semanal":
            newEndDate.setDate(newEndDate.getDate() + 7);
            break;
          case "quincenal":
            newEndDate.setDate(newEndDate.getDate() + 15);
            break;
          case "mensual":
            newEndDate.setMonth(newEndDate.getMonth() + 1);
            break;
        }

        await tx.subscription.update({
          where: { userId: order.userId },
          data: {
            plan: order.plan,
            status: "active",
            endDate: newEndDate,
          },
        });
      } else {
        // Create new subscription
        await tx.subscription.create({
          data: {
            userId: order.userId,
            plan: order.plan,
            status: "active",
            startDate: now,
            endDate: endDate,
          },
        });
      }
    });

    return NextResponse.json({
      message: "Orden aprobada y suscripción activada exitosamente",
    });
  } catch (error) {
    console.error("Error approving order:", error);
    return NextResponse.json(
      { message: "Error al aprobar la orden" },
      { status: 500 }
    );
  }
}
