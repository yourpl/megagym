interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  subscription: {
    status: string;
    plan: string;
  } | null;
  totalOrders: number;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onViewOrders: (user: User) => void;
  currentUserRole?: string;
}

export default function UserTable({ users, onEdit, onDelete, onViewOrders, currentUserRole }: UserTableProps) {
  const isRoot = currentUserRole === "root";
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="text-left py-4 px-6 text-gray-400 font-medium">
                Usuario
              </th>
              <th className="text-left py-4 px-6 text-gray-400 font-medium">
                Email
              </th>
              <th className="text-left py-4 px-6 text-gray-400 font-medium">
                Rol
              </th>
              <th className="text-left py-4 px-6 text-gray-400 font-medium">
                Suscripción
              </th>
              <th className="text-left py-4 px-6 text-gray-400 font-medium">
                Órdenes
              </th>
              <th className="text-left py-4 px-6 text-gray-400 font-medium">
                Fecha Registro
              </th>
              <th className="text-left py-4 px-6 text-gray-400 font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-6 text-white font-medium">
                  {user.name || "Sin nombre"}
                </td>
                <td className="py-4 px-6 text-gray-300">{user.email}</td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "root"
                        ? "bg-red-500/20 text-red-400"
                        : user.role === "admin"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {user.role === "root" ? "ROOT" : user.role === "admin" ? "Admin" : "Usuario"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {user.subscription ? (
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        user.subscription.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {user.subscription.plan}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">Sin plan</span>
                  )}
                </td>
                <td className="py-4 px-6 text-gray-300">{user.totalOrders}</td>
                <td className="py-4 px-6 text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewOrders(user)}
                      className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition-all text-sm"
                      title="Ver órdenes del usuario"
                    >
                      Órdenes
                    </button>
                    <button
                      onClick={() => onEdit(user)}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-all text-sm"
                    >
                      Editar
                    </button>
                    {isRoot && (
                      <button
                        onClick={() => onDelete(user.id)}
                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-all text-sm"
                        title="Solo usuarios ROOT pueden eliminar"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 px-6 text-center text-gray-500">
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
