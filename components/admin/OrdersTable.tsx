"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  userId: string;
  plan: string;
  amount: number;
  status: string;
  paymentMethod: string;
  reference: string | null;
  proofUrl: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

interface OrdersTableProps {
  orders: Order[];
  adminRole: string;
}

export default function OrdersTable({ orders, adminRole }: OrdersTableProps) {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleApprove = async (orderId: string) => {
    if (!confirm("¿Aprobar esta orden y activar la suscripción?")) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Error al aprobar orden");
        return;
      }

      alert("Orden aprobada y suscripción activada exitosamente");
      router.refresh();
    } catch (error) {
      alert("Error al aprobar orden");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (orderId: string) => {
    const reason = prompt("Motivo del rechazo:");
    if (!reason) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Error al rechazar orden");
        return;
      }

      alert("Orden rechazada exitosamente");
      router.refresh();
    } catch (error) {
      alert("Error al rechazar orden");
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const approvedOrders = orders.filter((o) => o.status === "approved");
  const rejectedOrders = orders.filter((o) => o.status === "rejected");

  return (
    <>
      {/* Pending Orders */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Pendientes ({pendingOrders.length})
        </h2>
        {pendingOrders.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center text-gray-500">
            No hay órdenes pendientes
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={handleViewDetails}
                onApprove={handleApprove}
                onReject={handleReject}
                isProcessing={isProcessing}
              />
            ))}
          </div>
        )}
      </div>

      {/* Approved Orders */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Aprobadas ({approvedOrders.length})
        </h2>
        {approvedOrders.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center text-gray-500">
            No hay órdenes aprobadas
          </div>
        ) : (
          <div className="grid gap-4">
            {approvedOrders.slice(0, 5).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={handleViewDetails}
                hideActions
              />
            ))}
          </div>
        )}
      </div>

      {/* Rejected Orders */}
      {rejectedOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Rechazadas ({rejectedOrders.length})
          </h2>
          <div className="grid gap-4">
            {rejectedOrders.slice(0, 5).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={handleViewDetails}
                hideActions
              />
            ))}
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

function OrderCard({
  order,
  onViewDetails,
  onApprove,
  onReject,
  isProcessing,
  hideActions,
}: {
  order: Order;
  onViewDetails: (order: Order) => void;
  onApprove?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
  isProcessing?: boolean;
  hideActions?: boolean;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-white font-bold">
              {order.customerName || order.user.name}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.status === "approved"
                  ? "bg-green-500/20 text-green-400"
                  : order.status === "pending"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {order.status === "approved"
                ? "Aprobada"
                : order.status === "pending"
                ? "Pendiente"
                : "Rechazada"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Plan:</span>
              <span className="text-white ml-2 capitalize">{order.plan}</span>
            </div>
            <div>
              <span className="text-gray-400">Monto:</span>
              <span className="text-white ml-2 font-bold">
                ${order.amount.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Método:</span>
              <span className="text-white ml-2 capitalize">
                {order.paymentMethod}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Fecha:</span>
              <span className="text-white ml-2">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {!hideActions && onApprove && onReject && (
          <div className="flex gap-2">
            <button
              onClick={() => onViewDetails(order)}
              className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all text-sm"
            >
              Ver Detalles
            </button>
            <button
              onClick={() => onApprove(order.id)}
              disabled={isProcessing}
              className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all text-sm disabled:opacity-50"
            >
              Aprobar
            </button>
            <button
              onClick={() => onReject(order.id)}
              disabled={isProcessing}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm disabled:opacity-50"
            >
              Rechazar
            </button>
          </div>
        )}
        {hideActions && (
          <button
            onClick={() => onViewDetails(order)}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all text-sm"
          >
            Ver Detalles
          </button>
        )}
      </div>
    </div>
  );
}

function OrderDetailsModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Detalles de la Orden</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Cliente</label>
              <p className="text-white">{order.customerName}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Email</label>
              <p className="text-white">{order.customerEmail}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Teléfono</label>
              <p className="text-white">{order.customerPhone}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Plan</label>
              <p className="text-white capitalize">{order.plan}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Monto</label>
              <p className="text-white font-bold">${order.amount.toFixed(2)}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Método de Pago</label>
              <p className="text-white capitalize">{order.paymentMethod}</p>
            </div>
            {order.reference && (
              <div>
                <label className="text-gray-400 text-sm">Referencia</label>
                <p className="text-white">{order.reference}</p>
              </div>
            )}
            <div>
              <label className="text-gray-400 text-sm">Estado</label>
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
                  ? "Aprobada"
                  : order.status === "pending"
                  ? "Pendiente"
                  : "Rechazada"}
              </span>
            </div>
          </div>

          {order.notes && (
            <div>
              <label className="text-gray-400 text-sm">Notas</label>
              <p className="text-white">{order.notes}</p>
            </div>
          )}

          {order.proofUrl && (
            <div>
              <label className="text-gray-400 text-sm">Comprobante de Pago</label>
              <a
                href={order.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-[#FFC700]"
              >
                Ver Comprobante →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
