import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { useAppStore } from "../../store/appStore";
import { getFreeCapacity } from "../../utils/capacity";

export function TeamUtilizationBar() {
  const { persons, assignments } = useAppStore();
  const now = new Date();

  const capacity = getFreeCapacity(persons, assignments, now)
    .filter((c) => c.person.availableHoursPerWeek > 0)
    .sort((a, b) => b.utilizationPercent - a.utilizationPercent)
    .slice(0, 15);

  const data = capacity.map((c) => ({
    name: c.person.name.split(" ").map((n, i, arr) => i === arr.length - 1 ? n : n[0] + ".").join(" "),
    fullName: c.person.name,
    utilization: Math.round(c.utilizationPercent),
    projects: c.activeProjectCount,
  }));

  const getBarColor = (val: number) => {
    if (val > 100) return "#EF4444";
    if (val >= 80) return "#F59E0B";
    return "#10B981";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Csapat terheltsége</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
          <XAxis type="number" domain={[0, 150]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value: any) => [`${value}%`, "Kihasználtság"]}
            labelFormatter={(_: any, payload: any) => payload?.[0]?.payload?.fullName ?? ""}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
          <ReferenceLine x={100} stroke="#EF4444" strokeDasharray="3 3" label={{ value: "100%", fontSize: 10, fill: "#EF4444" }} />
          <Bar dataKey="utilization" radius={[0, 4, 4, 0]} barSize={18}>
            {data.map((entry, i) => (
              <Cell key={i} fill={getBarColor(entry.utilization)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
