import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import SubscriptionsTable from "@/components/admin/SubscriptionsTable";

export default async function AdminSubscriptionsPage() {
  const admin = await getAdminUser();

  if (!admin) {
    redirect("/admin/login");
  }

  // Get all subscriptions
  const subscriptions = await prisma.subscription.findMany({
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
        <h1 className="text-3xl font-bold text-white mb-2">Suscripciones</h1>
        <p className="text-gray-400">
          Gestiona todas las suscripciones activas e inactivas
        </p>
      </div>

      <SubscriptionsTable subscriptions={subscriptions} />
    </AdminLayout>
  );
}
