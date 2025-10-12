"use client";

import { useState } from "react";

interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
}

export default function SubscriptionsTable({
  subscriptions,
}: SubscriptionsTableProps) {
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");

  const now = new Date();
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const isActive = new Date(sub.endDate) > now && sub.status === "active";

    if (filter === "active") return isActive;
    if (filter === "expired") return !isActive;
    return true;
  });

  const activeCount = subscriptions.filter(
    (sub) => new Date(sub.endDate) > now && sub.status === "active"
  ).length;

  const expiredCount = subscriptions.length - activeCount;

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            filter === "all"
              ? "bg-[#FFC700] text-black"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Todas ({subscriptions.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            filter === "active"
              ? "bg-green-500 text-white"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Activas ({activeCount})
        </button>
        <button
          onClick={() => setFilter("expired")}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            filter === "expired"
              ? "bg-red-500 text-white"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Vencidas ({expiredCount})
        </button>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left py-4 px-6 text-gray-400 font-medium">
                  Usuario
                </th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">
                  Plan
                </th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">
                  Estado
                </th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">
                  Inicio
                </th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">
                  Vencimiento
                </th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">
                  Días Restantes
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((sub) => {
                const endDate = new Date(sub.endDate);
                const isActive = endDate > now && sub.status === "active";
                const daysRemaining = Math.ceil(
                  (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <tr
                    key={sub.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">
                          {sub.user.name || "Sin nombre"}
                        </p>
                        <p className="text-gray-400 text-sm">{sub.user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 capitalize">
                        {sub.plan}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {isActive ? "Activa" : "Vencida"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      {new Date(sub.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      {endDate.toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-medium ${
                          daysRemaining > 7
                            ? "text-green-400"
                            : daysRemaining > 0
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {daysRemaining > 0
                          ? `${daysRemaining} días`
                          : "Vencida"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredSubscriptions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 px-6 text-center text-gray-500"
                  >
                    No se encontraron suscripciones
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
