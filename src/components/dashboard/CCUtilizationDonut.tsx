import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAppStore } from "../../store/appStore";
import { CompetencyCenter, CompetencyCenterLabels } from "../../types/person";
import { getUtilizationForMonth } from "../../utils/capacity";

const CC_COLORS: Record<CompetencyCenter, string> = {
  [CompetencyCenter.IT_DIGITAL]: "#3B82F6",
  [CompetencyCenter.FINANCE]: "#10B981",
  [CompetencyCenter.STRATEGY]: "#8B5CF6",
  [CompetencyCenter.OPERATIONS]: "#F59E0B",
  [CompetencyCenter.HR_CHANGE]: "#EC4899",
  [CompetencyCenter.DATA_AI]: "#06B6D4",
};

export function CCUtilizationDonut() {
  const { persons, assignments } = useAppStore();
  const now = new Date();

  const data = Object.values(CompetencyCenter).map((cc) => {
    const ccPersons = persons.filter((p) => p.competencyCenter === cc && p.isActive && p.availableHoursPerWeek > 0);
    const totalAvailable = ccPersons.reduce((s, p) => s + p.availableHoursPerWeek, 0);
    const totalAllocated = ccPersons.reduce((s, p) => {
      const u = getUtilizationForMonth(p.id, now, assignments, persons);
      return s + u.totalAllocatedHours;
    }, 0);

    return {
      name: CompetencyCenterLabels[cc],
      cc,
      utilization: totalAvailable > 0 ? Math.round((totalAllocated / totalAvailable) * 100) : 0,
      allocated: totalAllocated,
      available: totalAvailable,
      people: ccPersons.length,
    };
  }).filter((d) => d.people > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Kompetenciaközpont terhelés</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="allocated"
          >
            {data.map((entry) => (
              <Cell key={entry.cc} fill={CC_COLORS[entry.cc]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(_: unknown, __: unknown, entry: { payload: { name: string; utilization: number; people: number; allocated: number } }) => {
              const { name, utilization, people, allocated } = entry.payload;
              return [`${utilization}% (${allocated} h/hét, ${people} fő)`, name];
            }}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
          <Legend
            formatter={(value: string, entry: { payload?: { utilization?: number } }) => {
              const u = entry?.payload?.utilization;
              return `${value} (${u ?? 0}%)`;
            }}
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
