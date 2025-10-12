interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: string;
}

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        {trend && trend !== "none" && (
          <span
            className={`text-sm font-medium ${
              trend === "pending"
                ? "text-yellow-400"
                : trend.startsWith("+")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  );
}
