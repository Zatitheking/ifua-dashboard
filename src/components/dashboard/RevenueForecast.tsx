import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAppStore } from "../../store/appStore";
import { PipelineStatus } from "../../types/project";
import { addMonths, format, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";
import { hu } from "date-fns/locale";
import { formatCurrency } from "../../utils/format";

export function RevenueForecast() {
  const { projects } = useAppStore();
  const now = new Date();

  const months = Array.from({ length: 12 }, (_, i) => addMonths(now, i));

  const data = months.map((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const label = format(month, "MMM yyyy", { locale: hu });

    let won = 0;
    let pipeline = 0;

    projects.forEach((p) => {
      if (p.status === PipelineStatus.LOST) return;
      const pStart = new Date(p.startDate);
      const pEnd = new Date(p.endDate);

      try {
        const overlaps =
          pStart <= monthEnd && pEnd >= monthStart;
        if (!overlaps) return;

        const projectMonths = Math.max(1, Math.ceil((pEnd.getTime() - pStart.getTime()) / (30 * 24 * 60 * 60 * 1000)));
        const monthlyRevenue = p.expectedRevenue / projectMonths;

        if ([PipelineStatus.WON, PipelineStatus.ACTIVE, PipelineStatus.COMPLETED].includes(p.status)) {
          won += monthlyRevenue * (p.probability / 100);
        } else {
          pipeline += monthlyRevenue * (p.probability / 100);
        }
      } catch {}
    });

    return { label, won: Math.round(won), pipeline: Math.round(pipeline) };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue Forecast — következő 12 hónap</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value: any, name: any) => [
              formatCurrency(value as number),
              name === "won" ? "Megnyert/Futó" : "Pipeline",
            ]}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
          <Area type="monotone" dataKey="won" stackId="1" stroke="#059669" fill="#D1FAE5" name="won" />
          <Area type="monotone" dataKey="pipeline" stackId="1" stroke="#60A5FA" fill="#DBEAFE" name="pipeline" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
