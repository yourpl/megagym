import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import OrdersTable from "@/components/admin/OrdersTable";

export default async function AdminOrdersPage() {
  const admin = await getAdminUser();

  if (!admin) {
    redirect("/admin/login");
  }

  // Get all payment orders
  const orders = await prisma.paymentOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return (
    <AdminLayout adminName={admin.name}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Órdenes de Pago
        </h1>
        <p className="text-gray-400">
          Revisa y gestiona todas las órdenes de pago
        </p>
      </div>

      <OrdersTable orders={orders} adminRole={admin.role} />
    </AdminLayout>
  );
}
