"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import UserTable from "@/components/admin/UserTable";
import UserEditModal from "@/components/admin/UserEditModal";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  subscription: {
    id: string;
    status: string;
    plan: string;
    endDate: string;
  } | null;
  lastPayment: {
    amount: number;
    status: string;
  } | null;
  totalOrders: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [createFormData, setCreateFormData] = useState({
    name: "",
    email: "",
    password: "",
    sex: "",
    age: "",
    role: "user",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    planId: "semanal",
    paymentMethod: "",
    reference: "",
    notes: "",
    autoApprove: true,
  });
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const fetchUsers = async (page = 1, searchQuery = "") => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/users?page=${page}&limit=10&search=${searchQuery}`
      );

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        throw new Error("Error al cargar usuarios");
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch current user info
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => setCurrentUserRole(data.role))
      .catch(console.error);

    fetchUsers(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, search);
  };

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage, search);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleViewOrders = async (user: User) => {
    setSelectedUser(user);
    setIsOrdersModalOpen(true);
    setLoadingOrders(true);
    setUserOrders([]);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`);
      if (!response.ok) {
        throw new Error("Error al cargar órdenes");
      }

      const data = await response.json();
      setUserOrders(data.paymentOrders || []);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      alert("Error al cargar las órdenes del usuario");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar usuario");
      }

      // Refresh the list
      fetchUsers(pagination.page, search);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error al eliminar usuario");
    }
  };

  const handleSave = async (userData: Partial<User>) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar usuario");
      }

      setIsEditModalOpen(false);
      fetchUsers(pagination.page, search);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error al actualizar usuario");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear usuario");
      }

      alert("Usuario creado exitosamente");
      setIsCreateModalOpen(false);
      setCreateFormData({
        name: "",
        email: "",
        password: "",
        sex: "",
        age: "",
        role: "user",
      });
      fetchUsers(pagination.page, search);
    } catch (error: any) {
      console.error("Error creating user:", error);
      alert(error.message || "Error al crear usuario");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsCreatingOrder(true);

    try {
      const response = await fetch("/api/admin/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          ...orderFormData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear orden");
      }

      alert(data.message);
      setIsCreateOrderModalOpen(false);
      setOrderFormData({
        planId: "semanal",
        paymentMethod: "",
        reference: "",
        notes: "",
        autoApprove: true,
      });

      // Refresh user orders if orders modal is open
      if (isOrdersModalOpen) {
        handleViewOrders(selectedUser);
      }

      // Refresh users list
      fetchUsers(pagination.page, search);
    } catch (error: any) {
      console.error("Error creating order:", error);
      alert(error.message || "Error al crear orden");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string, userId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta suscripción? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al eliminar suscripción");
      }

      alert("Suscripción eliminada exitosamente");
      fetchUsers(pagination.page, search);
    } catch (error: any) {
      console.error("Error deleting subscription:", error);
      alert(error.message || "Error al eliminar suscripción");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta orden? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al eliminar orden");
      }

      alert("Orden eliminada exitosamente");

      // Refresh orders if modal is open
      if (selectedUser) {
        handleViewOrders(selectedUser);
      }

      // Refresh users list
      fetchUsers(pagination.page, search);
    } catch (error: any) {
      console.error("Error deleting order:", error);
      alert(error.message || "Error al eliminar orden");
    }
  };

  return (
    <AdminLayout adminName="Admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Gestión de Usuarios
        </h1>
        <p className="text-gray-400">
          Administra todos los usuarios de la plataforma
        </p>
      </div>

      {/* Search Bar and Create Button */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC700] focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#FFC700] text-black font-bold rounded-lg hover:bg-[#FFD700] transition-all"
          >
            Buscar
          </button>
        </form>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all whitespace-nowrap"
        >
          + Crear Usuario
        </button>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-[#FFC700] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">Cargando usuarios...</p>
        </div>
      ) : (
        <>
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewOrders={handleViewOrders}
            onDeleteSubscription={handleDeleteSubscription}
            currentUserRole={currentUserRole}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-gray-400">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Orders Modal */}
      {isOrdersModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Órdenes de {selectedUser.name || selectedUser.email}
                </h2>
                <p className="text-gray-400 text-sm">
                  Total de órdenes: {selectedUser.totalOrders}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsCreateOrderModalOpen(true)}
                  className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all text-sm"
                >
                  + Crear Orden
                </button>
                <button
                  onClick={() => setIsOrdersModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {loadingOrders ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-[#FFC700] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 mt-4">Cargando órdenes...</p>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Este usuario no tiene órdenes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-bold capitalize">
                          Plan {order.plan}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(order.createdAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-white font-bold text-xl">
                            ${order.amount.toFixed(2)}
                          </p>
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
                        </div>
                        {currentUserRole === "root" && (
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-2"
                            title="Eliminar orden (ROOT)"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Método de pago:</span>
                        <p className="text-white capitalize">
                          {order.paymentMethod}
                        </p>
                      </div>
                      {order.reference && (
                        <div>
                          <span className="text-gray-400">Referencia:</span>
                          <p className="text-white">{order.reference}</p>
                        </div>
                      )}
                      {order.reviewedBy && (
                        <div>
                          <span className="text-gray-400">Revisado por:</span>
                          <p className="text-white">{order.reviewedBy}</p>
                        </div>
                      )}
                      {order.reviewedAt && (
                        <div>
                          <span className="text-gray-400">
                            Fecha de revisión:
                          </span>
                          <p className="text-white">
                            {new Date(order.reviewedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {order.proofUrl && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <a
                          href={order.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FFC700] hover:underline text-sm"
                        >
                          Ver comprobante de pago →
                        </a>
                      </div>
                    )}

                    {order.notes && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <span className="text-gray-400 text-sm">Notas:</span>
                        <p className="text-white text-sm mt-1">{order.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Crear Usuario</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={createFormData.name}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={createFormData.email}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña *
                </label>
                <input
                  type="password"
                  required
                  value={createFormData.password}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sexo *
                </label>
                <select
                  required
                  value={createFormData.sex}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, sex: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFC700] [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="" disabled>Seleccionar sexo</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Edad *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={createFormData.age}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, age: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                  placeholder="Edad"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rol
                </label>
                <select
                  value={createFormData.role}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, role: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFC700] [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                  <option value="root">Root</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isCreating}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
                >
                  {isCreating ? "Creando..." : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {isCreateOrderModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Crear Orden</h2>
              <button
                onClick={() => setIsCreateOrderModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <p className="text-gray-400 text-sm">Usuario:</p>
                <p className="text-white font-bold">
                  {selectedUser.name || selectedUser.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plan *
                </label>
                <select
                  value={orderFormData.planId}
                  onChange={(e) =>
                    setOrderFormData({ ...orderFormData, planId: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFC700] [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="diario">Diario - $3.00</option>
                  <option value="semanal">Semanal - $11.99</option>
                  <option value="quincenal">Quincenal - $19.99</option>
                  <option value="mensual">Mensual - $37.99</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Método de Pago
                </label>
                <select
                  value={orderFormData.paymentMethod}
                  onChange={(e) =>
                    setOrderFormData({ ...orderFormData, paymentMethod: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFC700] [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="" disabled>Seleccionar metodo</option>
                  <option value="cash">Efectivo</option>
                  <option value="transfer">Transferencia</option>
                  <option value="paypal">PayPal</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Referencia (Opcional)
                </label>
                <input
                  type="text"
                  value={orderFormData.reference}
                  onChange={(e) =>
                    setOrderFormData({ ...orderFormData, reference: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                  placeholder="Número de transacción o referencia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notas (Opcional)
                </label>
                <textarea
                  value={orderFormData.notes}
                  onChange={(e) =>
                    setOrderFormData({ ...orderFormData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                  placeholder="Información adicional..."
                />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={orderFormData.autoApprove}
                    onChange={(e) =>
                      setOrderFormData({
                        ...orderFormData,
                        autoApprove: e.target.checked,
                      })
                    }
                    className="w-5 h-5 bg-white/5 border border-white/20 rounded focus:ring-2 focus:ring-[#FFC700]"
                  />
                  <div>
                    <p className="text-white font-medium">Aprobar Automáticamente</p>
                    <p className="text-gray-400 text-xs">
                      La suscripción se activará inmediatamente
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOrderModalOpen(false)}
                  disabled={isCreatingOrder}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="flex-1 px-4 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
                >
                  {isCreatingOrder ? "Creando..." : "Crear Orden"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
