import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAppStore } from "../../store/appStore";
import { Industry, PipelineStatus } from "../../types/project";
import { formatCurrency } from "../../utils/format";

const INDUSTRY_CC_LABELS: Record<Industry, string> = {
  [Industry.BANKING]: "FI",
  [Industry.INSURANCE]: "FI",
  [Industry.TELECOM]: "TMT",
  [Industry.ENERGY]: "Energetika",
  [Industry.MANUFACTURING]: "Industry",
  [Industry.PHARMA]: "Life Sciences",
  [Industry.RETAIL]: "Consumer",
  [Industry.PUBLIC_SECTOR]: "Public",
  [Industry.IT]: "TMT",
  [Industry.AUTOMOTIVE]: "Industry",
  [Industry.LOGISTICS]: "Transportation",
  [Industry.FMCG]: "Consumer",
};

const CC_COLORS: Record<string, string> = {
  "FI": "#3B82F6",
  "TMT": "#8B5CF6",
  "Energetika": "#F59E0B",
  "Industry": "#6366F1",
  "Life Sciences": "#10B981",
  "Consumer": "#EC4899",
  "Public": "#64748B",
  "Transportation": "#06B6D4",
};

export function IndustryDistribution() {
  const { projects } = useAppStore();

  const activeProjects = projects.filter((p) =>
    ![PipelineStatus.LOST, PipelineStatus.COMPLETED].includes(p.status)
  );

  const grouped: Record<string, { label: string; count: number; revenue: number }> = {};
  activeProjects.forEach((p) => {
    const label = INDUSTRY_CC_LABELS[p.industry];
    if (!grouped[label]) grouped[label] = { label, count: 0, revenue: 0 };
    grouped[label].count++;
    grouped[label].revenue += p.weightedRevenue;
  });

  const data = Object.values(grouped).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Iparági CC eloszlás</h3>
      <p className="text-[10px] text-gray-400 mb-3">Aktív pipeline projektek iparág szerint</p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="revenue"
            nameKey="label"
          >
            {data.map((entry) => (
              <Cell key={entry.label} fill={CC_COLORS[entry.label] ?? "#94A3B8"} />
            ))}
          </Pie>
          <Tooltip
            formatter={(_: any, __: any, entry: any) => {
              const { label, count, revenue } = entry.payload;
              return [`${count} projekt · ${formatCurrency(revenue)}`, label];
            }}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
          <Legend
            formatter={(value: any, entry: any) => {
              const count = entry?.payload?.count;
              return `${value} (${count ?? 0})`;
            }}
            wrapperStyle={{ fontSize: 11 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
