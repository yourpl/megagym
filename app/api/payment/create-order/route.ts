import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PLAN_PRICES = {
  diario: 3.00,
  semanal: 11.99,
  quincenal: 19.99,
  mensual: 37.99,
} as const;

type PlanType = keyof typeof PLAN_PRICES;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const { planId, paymentMethod, reference, proofUrl, customerData, notes } =
      await request.json();

    // Validate plan
    if (!PLAN_PRICES[planId as PlanType]) {
      return NextResponse.json({ message: "Plan inválido" }, { status: 400 });
    }

    const amount = PLAN_PRICES[planId as PlanType];

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado. Por favor, inicia sesión nuevamente." },
        { status: 404 }
      );
    }

    // Create payment order
    const order = await prisma.paymentOrder.create({
      data: {
        userId: session.user.id,
        plan: planId,
        amount,
        status: "pending",
        paymentMethod,
        reference,
        proofUrl,
        customerName: customerData.fullName,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        notes,
      },
    });

    return NextResponse.json({
      message: "Orden creada exitosamente",
      orderId: order.id,
    });
  } catch (error: any) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { message: error.message || "Error al crear la orden" },
      { status: 500 }
    );
  }
}
