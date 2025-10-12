import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get user with subscription
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      paymentOrders: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const hasActiveSubscription =
    user.subscription?.status === "active" &&
    new Date(user.subscription.endDate) > new Date();

  const daysRemaining = user.subscription
    ? Math.ceil(
        (new Date(user.subscription.endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Mi <span className="text-[#FFC700]">Perfil</span>
            </h1>
            <p className="text-gray-400">
              Gestiona tu cuenta y suscripción
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Información Personal
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Nombre</label>
                    <p className="text-white font-medium">
                      {user.name || "No especificado"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">
                      Miembro desde
                    </label>
                    <p className="text-white font-medium">
                      {new Date(user.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">
                    Órdenes Recientes
                  </h2>
                  <a
                    href="/orders"
                    className="text-sm text-[#FFC700] hover:underline"
                  >
                    Ver todas →
                  </a>
                </div>
                {user.paymentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No hay órdenes todavía
                  </p>
                ) : (
                  <div className="space-y-3">
                    {user.paymentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium capitalize">
                            Plan {order.plan}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">
                            ${order.amount.toFixed(2)}
                          </p>
                          <span
                            className={`text-xs ${
                              order.status === "approved"
                                ? "text-green-400"
                                : order.status === "pending"
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {order.status === "approved"
                              ? "Aprobado"
                              : order.status === "pending"
                              ? "Pendiente"
                              : "Rechazado"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Subscription Card */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#FFC700]/20 to-[#FFC700]/5 border border-[#FFC700]/30 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Mi Suscripción
                </h2>

                {hasActiveSubscription && user.subscription ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Plan Actual</p>
                      <p className="text-2xl font-bold text-[#FFC700] capitalize">
                        {user.subscription.plan}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Estado</p>
                      <span className="inline-flex items-center gap-2 text-green-400 font-medium">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Activa
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Fecha de Vencimiento
                      </p>
                      <p className="text-white font-medium">
                        {new Date(
                          user.subscription.endDate
                        ).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#FFC700]/30">
                      <p className="text-sm text-gray-400 mb-2">
                        Días Restantes
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">
                          {daysRemaining}
                        </span>
                        <span className="text-gray-400">días</span>
                      </div>
                    </div>

                    <a
                      href="/select-plan"
                      className="block w-full text-center bg-[#FFC700] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#FFD700] transition-all mt-4"
                    >
                      Renovar Plan
                    </a>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-4">🔒</div>
                    <p className="text-gray-400 mb-6">
                      No tienes una suscripción activa
                    </p>
                    <a
                      href="/select-plan"
                      className="block w-full text-center bg-[#FFC700] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#FFD700] transition-all"
                    >
                      Elegir Plan
                    </a>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Acciones Rápidas
                </h3>
                <div className="space-y-2">
                  <a
                    href="/orders"
                    className="block px-4 py-3 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-all"
                  >
                    📋 Ver Mis Órdenes
                  </a>
                  <a
                    href="/select-plan"
                    className="block px-4 py-3 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-all"
                  >
                    💳 Planes y Precios
                  </a>
                  <a
                    href="/"
                    className="block px-4 py-3 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-all"
                  >
                    🏠 Ir al Inicio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
