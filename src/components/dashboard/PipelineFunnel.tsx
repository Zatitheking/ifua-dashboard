import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useAppStore } from "../../store/appStore";
import { PipelineStatus, PipelineStatusLabels, PipelineStatusColors, PIPELINE_ORDER } from "../../types/project";
import { formatCurrency } from "../../utils/format";

export function PipelineFunnel() {
  const { projects } = useAppStore();

  const data = PIPELINE_ORDER.map((status) => {
    const statusProjects = projects.filter((p) => p.status === status);
    return {
      status,
      label: PipelineStatusLabels[status],
      count: statusProjects.length,
      value: statusProjects.reduce((s, p) => s + p.weightedRevenue, 0),
      color: PipelineStatusColors[status],
    };
  }).filter((d) => d.count > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Pipeline Funnel</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Súlyozott érték"]}
            labelFormatter={(label) => `${label}`}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
            {data.map((entry) => (
              <Cell key={entry.status} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
