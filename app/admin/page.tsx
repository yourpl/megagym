import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";

export default async function AdminDashboardPage() {
  const admin = await getAdminUser();

  if (!admin) {
    redirect("/admin/login");
  }

  // Get statistics
  const [totalUsers, totalSubscriptions, pendingOrders, totalRevenue] =
    await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({
        where: { status: "active" },
      }),
      prisma.paymentOrder.count({
        where: { status: "pending" },
      }),
      prisma.paymentOrder.aggregate({
        where: { status: "approved" },
        _sum: { amount: true },
      }),
    ]);

  // Get recent orders
  const recentOrders = await prisma.paymentOrder.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return (
    <AdminLayout adminName={admin.name}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Bienvenido de vuelta, {admin.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Usuarios Totales"
          value={totalUsers.toString()}
          icon="👥"
          trend="+12%"
        />
        <StatsCard
          title="Suscripciones Activas"
          value={totalSubscriptions.toString()}
          icon="✅"
          trend="+8%"
        />
        <StatsCard
          title="Órdenes Pendientes"
          value={pendingOrders.toString()}
          icon="⏳"
          trend={pendingOrders > 0 ? "pending" : "none"}
        />
        <StatsCard
          title="Ingresos Totales"
          value={`$${(totalRevenue._sum.amount || 0).toFixed(2)}`}
          icon="💰"
          trend="+15%"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Órdenes Recientes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                  Usuario
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                  Plan
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                  Monto
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                  Estado
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 text-white">
                    {order.user.name || order.user.email}
                  </td>
                  <td className="py-3 px-4 text-gray-300 capitalize">
                    {order.plan}
                  </td>
                  <td className="py-3 px-4 text-white font-medium">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {order.status === "approved"
                        ? "Aprobado"
                        : order.status === "pending"
                        ? "Pendiente"
                        : "Rechazado"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 px-4 text-center text-gray-500"
                  >
                    No hay órdenes recientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
