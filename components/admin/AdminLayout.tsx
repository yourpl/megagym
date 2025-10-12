"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
  adminName: string;
}

export default function AdminLayout({ children, adminName }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-black/50 backdrop-blur-sm border-r border-white/10 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#FFC700]">MegaGym</h2>
          <p className="text-gray-400 text-sm">Panel Admin</p>
        </div>

        <nav className="space-y-2">
          <Link
            href="/admin"
            className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-[#FFC700] transition-all"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-[#FFC700] transition-all"
          >
            👥 Usuarios
          </Link>
          <Link
            href="/admin/orders"
            className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-[#FFC700] transition-all"
          >
            📋 Órdenes
          </Link>
          <Link
            href="/admin/subscriptions"
            className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-[#FFC700] transition-all"
          >
            ✅ Suscripciones
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="mb-4 p-4 bg-white/5 rounded-lg">
            <p className="text-sm text-gray-400">Conectado como</p>
            <p className="text-white font-medium">{adminName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
