import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell, PieChart, Pie, Cell as PieCell, Legend } from "recharts";
import { addMonths, format } from "date-fns";
import { hu } from "date-fns/locale";
import { useAppStore } from "../../../store/appStore";
import { type Person } from "../../../types/person";
import { PipelineStatus } from "../../../types/project";
import { AssignmentRole, AssignmentRoleLabels, AssignmentRoleColors } from "../../../types/assignment";
import { getUtilizationForMonth } from "../../../utils/capacity";
import { Avatar } from "../../ui/Avatar";

interface PersonStatsTabProps {
  person: Person;
}

export function PersonStatsTab({ person }: PersonStatsTabProps) {
  const { projects, assignments, persons } = useAppStore();

  const personAssignments = assignments.filter((a) => a.personId === person.id);
  const assignedProjects = personAssignments.map((a) => projects.find((p) => p.id === a.projectId)).filter(Boolean);

  const activeProjects = assignedProjects.filter((p) => p && [PipelineStatus.WON, PipelineStatus.ACTIVE].includes(p.status)).length;
  const pipelineProjects = assignedProjects.filter((p) => p && [PipelineStatus.PROPOSAL, PipelineStatus.SUBMITTED, PipelineStatus.NEGOTIATION].includes(p.status)).length;
  const completedProjects = assignedProjects.filter((p) => p && p.status === PipelineStatus.COMPLETED).length;

  const activeAssignments = personAssignments.filter((a) => {
    const p = projects.find((pr) => pr.id === a.projectId);
    return p && [PipelineStatus.WON, PipelineStatus.ACTIVE].includes(p.status);
  });
  const avgAllocation = activeAssignments.length > 0
    ? activeAssignments.reduce((s, a) => s + a.allocationPercent, 0) / activeAssignments.length
    : 0;

  // Monthly capacity chart
  const now = new Date();
  const monthlyData = Array.from({ length: 8 }, (_, i) => {
    const month = addMonths(now, i - 1);
    const u = getUtilizationForMonth(person.id, month, assignments, persons);
    return {
      label: format(month, "MMM", { locale: hu }),
      allocated: u.totalAllocatedHours,
      available: u.availableHours,
      utilization: u.utilizationPercent,
    };
  });

  // Role breakdown
  const roleBreakdown = Object.values(AssignmentRole).map((role) => {
    const count = personAssignments.filter((a) => a.assignmentRole === role).length;
    return { role, name: AssignmentRoleLabels[role], value: count, fill: AssignmentRoleColors[role] };
  }).filter((r) => r.value > 0);

  const getBarColor = (utilization: number) => {
    if (utilization > 100) return "#EF4444";
    if (utilization >= 80) return "#F59E0B";
    return "#10B981";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar name={person.name} size="lg" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
          <p className="text-sm text-gray-500">{person.title}</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Összes projekt", value: assignedProjects.length },
          { label: "Aktív", value: activeProjects },
          { label: "Pipeline", value: pipelineProjects },
          { label: "Befejezett", value: completedProjects },
          { label: "Átl. allokáció", value: `${Math.round(avgAllocation)}%` },
          { label: "Heti kapacitás", value: `${person.availableHoursPerWeek}h` },
        ].map((card) => (
          <div key={card.label} className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">{card.label}</div>
            <div className="text-xl font-bold text-gray-900 mt-0.5">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Monthly chart */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Havi kapacitás</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}h`} />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value}h/hét`,
                name === "allocated" ? "Allokált" : "Elérhető",
              ]}
              contentStyle={{ borderRadius: 8, fontSize: 13 }}
            />
            <ReferenceLine y={person.availableHoursPerWeek} stroke="#EF4444" strokeDasharray="3 3" />
            <Bar dataKey="allocated" radius={[4, 4, 0, 0]} barSize={28}>
              {monthlyData.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry.utilization)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Role breakdown */}
      {roleBreakdown.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Szerep megoszlás</h4>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={roleBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                {roleBreakdown.map((entry) => (
                  <PieCell key={entry.role} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
