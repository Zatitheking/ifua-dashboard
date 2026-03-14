import { TrendingUp, Target, Award, DollarSign, Users, Activity, AlertTriangle, Clock } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { PipelineStatus } from "../../types/project";
import { formatCurrency } from "../../utils/format";
import { getFreeCapacity } from "../../utils/capacity";

export function KpiCards() {
  const { projects, persons, assignments } = useAppStore();
  const now = new Date();

  // Pipeline KPIs
  const activeDeals = projects.filter(
    (p) => ![PipelineStatus.COMPLETED, PipelineStatus.LOST].includes(p.status)
  );
  const totalPipeline = activeDeals.reduce((s, p) => s + p.expectedRevenue, 0);
  const weightedPipeline = activeDeals.reduce((s, p) => s + p.weightedRevenue, 0);

  const won = projects.filter((p) => p.status === PipelineStatus.WON || p.status === PipelineStatus.ACTIVE || p.status === PipelineStatus.COMPLETED);
  const lost = projects.filter((p) => p.status === PipelineStatus.LOST);
  const winRate = won.length + lost.length > 0 ? (won.length / (won.length + lost.length)) * 100 : 0;

  const avgDealSize = activeDeals.length > 0 ? totalPipeline / activeDeals.length : 0;

  // People KPIs
  const activePersons = persons.filter((p) => p.isActive && p.availableHoursPerWeek > 0);
  const capacityData = getFreeCapacity(persons, assignments, now);
  const activeCapacity = capacityData.filter((c) => c.activeProjectCount > 0);
  const avgUtilization = activeCapacity.length > 0
    ? activeCapacity.reduce((s, c) => s + c.utilizationPercent, 0) / activeCapacity.length
    : 0;
  const overallocated = capacityData.filter((c) => c.isOverallocated).length;
  const freeHours = capacityData
    .filter((c) => c.utilizationPercent < 80)
    .reduce((s, c) => s + c.freeHoursPerWeek, 0);

  const cards = [
    { label: "Pipeline értéke", value: formatCurrency(totalPipeline), icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Súlyozott pipeline", value: formatCurrency(weightedPipeline), icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Win Rate", value: `${Math.round(winRate)}%`, icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Átl. deal méret", value: formatCurrency(avgDealSize), icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Aktív tanácsadók", value: `${activePersons.length} fő`, icon: Users, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Átl. kihasználtság", value: `${Math.round(avgUtilization)}%`, icon: Activity, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Túlterhelt", value: `${overallocated} fő`, icon: AlertTriangle, color: overallocated > 0 ? "text-red-600" : "text-gray-600", bg: overallocated > 0 ? "bg-red-50" : "bg-gray-50" },
    { label: "Szabad kapacitás", value: `${Math.round(freeHours)} h/hét`, icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
            <div className={`${card.bg} p-2.5 rounded-lg`}>
              <card.icon size={20} className={card.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
