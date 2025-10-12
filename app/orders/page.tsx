"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PaymentOrder {
  id: string;
  plan: string;
  amount: number;
  status: string;
  paymentMethod: string;
  reference: string | null;
  proofUrl: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/payment/orders");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-[#FFC700]";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprobado";
      case "rejected":
        return "Rechazado";
      default:
        return "Pendiente";
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "semanal":
        return "Plan Semanal";
      case "quincenal":
        return "Plan Quincenal";
      case "mensual":
        return "Plan Mensual";
      default:
        return plan;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "transfer":
        return "Transferencia";
      case "paypal":
        return "PayPal";
      case "cash":
        return "Efectivo";
      default:
        return "Otro";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Cargando órdenes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Mis <span className="text-[#FFC700]">Órdenes</span>
          </h1>
          <p className="text-gray-400">
            Historial de tus órdenes de pago y suscripciones
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-white mb-2">
              No tienes órdenes aún
            </h2>
            <p className="text-gray-400 mb-6">
              Cuando realices un pago, tus órdenes aparecerán aquí
            </p>
            <Link
              href="/checkout"
              className="inline-block bg-[#FFC700] text-black px-6 py-3 rounded-md font-bold hover:bg-[#FFD700] transition-colors"
            >
              Realizar Pago
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {getPlanName(order.plan)}
                      </h3>
                      <span
                        className={`text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-400">
                      <p>
                        <span className="text-gray-500">Monto:</span>{" "}
                        <span className="text-white font-medium">
                          ${order.amount}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-500">Método:</span>{" "}
                        {getPaymentMethodName(order.paymentMethod)}
                      </p>
                      {order.reference && (
                        <p>
                          <span className="text-gray-500">Referencia:</span>{" "}
                          {order.reference}
                        </p>
                      )}
                      <p>
                        <span className="text-gray-500">Fecha:</span>{" "}
                        {new Date(order.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {order.proofUrl && (
                      <a
                        href={order.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#FFC700] hover:underline"
                      >
                        Ver Comprobante →
                      </a>
                    )}
                    <div className="text-xs text-gray-500 font-mono">
                      ID: {order.id.slice(0, 8)}...
                    </div>
                  </div>
                </div>

                {order.status === "pending" && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="bg-[#FFC700]/10 border border-[#FFC700]/30 rounded-lg p-3">
                      <p className="text-sm text-gray-300">
                        ⏳ Tu pago está siendo revisado. Te notificaremos por
                        email cuando sea procesado.
                      </p>
                    </div>
                  </div>
                )}

                {order.status === "rejected" && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-sm text-gray-300">
                        ❌ Este pago fue rechazado. Por favor, contacta con
                        soporte para más información.
                      </p>
                    </div>
                  </div>
                )}

                {order.status === "approved" && order.reviewedAt && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <p className="text-sm text-gray-300">
                        ✅ Aprobado el{" "}
                        {new Date(order.reviewedAt).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
