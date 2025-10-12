import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const PLAN_PRICES = {
  diario: 3.00,
  semanal: 11.99,
  quincenal: 19.99,
  mensual: 37.99,
} as const;

type PlanType = keyof typeof PLAN_PRICES;

// POST - Create order for a user (admin only)
export async function POST(request: Request) {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json(
      { message: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const { userId, planId, paymentMethod, reference, notes, autoApprove } = await request.json();

    // Validate required fields
    if (!userId || !planId) {
      return NextResponse.json(
        { message: "userId y planId son requeridos" },
        { status: 400 }
      );
    }

    // Validate plan
    if (!PLAN_PRICES[planId as PlanType]) {
      return NextResponse.json(
        { message: "Plan inválido" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const amount = PLAN_PRICES[planId as PlanType];

    // Create payment order
    const order = await prisma.paymentOrder.create({
      data: {
        userId,
        plan: planId,
        amount,
        status: autoApprove ? "approved" : "pending",
        paymentMethod: paymentMethod || "admin-created",
        reference: reference || `ADMIN-${Date.now()}`,
        customerName: user.name || "",
        customerEmail: user.email || "",
        customerPhone: "",
        notes: notes || `Orden creada por administrador: ${admin.email}`,
        reviewedBy: autoApprove ? admin.email : null,
        reviewedAt: autoApprove ? new Date() : null,
      },
    });

    // If auto-approve, activate subscription
    if (autoApprove) {
      const now = new Date();
      const endDate = new Date(now);

      switch (planId) {
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
      }

      // Check if user already has a subscription
      const existingSubscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (existingSubscription) {
        // Extend existing subscription
        const currentEndDate = new Date(existingSubscription.endDate);
        const isActive = currentEndDate > now;

        const newEndDate = new Date(isActive ? currentEndDate : now);

        switch (planId) {
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

        await prisma.subscription.update({
          where: { userId },
          data: {
            plan: planId,
            status: "active",
            endDate: newEndDate,
          },
        });
      } else {
        // Create new subscription
        await prisma.subscription.create({
          data: {
            userId,
            plan: planId,
            status: "active",
            startDate: now,
            endDate,
          },
        });
      }
    }

    return NextResponse.json(
      {
        message: autoApprove
          ? "Orden creada y suscripción activada exitosamente"
          : "Orden creada exitosamente",
        order: {
          id: order.id,
          plan: order.plan,
          amount: order.amount,
          status: order.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Error al crear la orden" },
      { status: 500 }
    );
  }
}
