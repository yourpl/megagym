import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PLAN_DETAILS = {
  semanal: { days: 7, name: "Plan Semanal" },
  quincenal: { days: 15, name: "Plan Quincenal" },
  mensual: { days: 30, name: "Plan Mensual" },
} as const;

type PlanType = keyof typeof PLAN_DETAILS;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    const { planId } = await request.json();

    // Validate plan
    if (!PLAN_DETAILS[planId as PlanType]) {
      return NextResponse.json(
        { message: "Plan inválido" },
        { status: 400 }
      );
    }

    const planDetails = PLAN_DETAILS[planId as PlanType];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + planDetails.days);

    // Create or update subscription
    const subscription = await prisma.subscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        plan: planId,
        status: "active",
        startDate,
        endDate,
      },
      update: {
        plan: planId,
        status: "active",
        startDate,
        endDate,
      },
    });

    return NextResponse.json({
      message: "Suscripción activada exitosamente",
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        endDate: subscription.endDate,
      },
    });
  } catch (error: any) {
    console.error("Error activating subscription:", error);
    return NextResponse.json(
      { message: error.message || "Error al activar la suscripción" },
      { status: 500 }
    );
  }
}
