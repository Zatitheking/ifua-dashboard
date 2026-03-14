import { useState } from "react";
import { useAppStore } from "../../store/appStore";
import { CompetencyCenter, CompetencyCenterLabels } from "../../types/person";
import { getHeatmapData, getCapacityColor, getCapacityTextColor } from "../../utils/capacity";
import { AssignmentRoleLabels } from "../../types/assignment";
import { Avatar } from "../ui/Avatar";
import { addMonths } from "date-fns";

interface UtilizationHeatmapProps {
  onPersonClick: (id: string) => void;
}

export function UtilizationHeatmap({ onPersonClick }: UtilizationHeatmapProps) {
  const { persons, assignments, projects } = useAppStore();
  const [ccFilter, setCcFilter] = useState<CompetencyCenter | "all">("all");
  const [hoveredCell, setHoveredCell] = useState<{ personId: string; monthIdx: number } | null>(null);

  const now = new Date();
  const startMonth = now;
  const heatmapData = getHeatmapData(
    ccFilter === "all" ? persons : persons.filter((p) => p.competencyCenter === ccFilter),
    assignments,
    startMonth,
    8
  );

  const getTooltipContent = (personId: string, monthIdx: number) => {
    const month = addMonths(startMonth, monthIdx);
    const personAssignments = assignments.filter((a) => {
      if (a.personId !== personId) return false;
      const start = new Date(a.startDate);
      const end = new Date(a.endDate);
      return start <= month && end >= month;
    });
    return personAssignments.map((a) => {
      const project = projects.find((p) => p.id === a.projectId);
      return {
        projectName: project?.company ?? "Ismeretlen",
        role: AssignmentRoleLabels[a.assignmentRole],
        hours: a.allocatedHoursPerWeek,
      };
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Kihasználtság hőtérkép</h3>
        <select
          value={ccFilter}
          onChange={(e) => setCcFilter(e.target.value as CompetencyCenter | "all")}
          className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]"
        >
          <option value="all">Minden CC</option>
          {Object.values(CompetencyCenter).map((cc) => (
            <option key={cc} value={cc}>{CompetencyCenterLabels[cc]}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 pb-2 pr-4 min-w-[180px]">Személy</th>
              {heatmapData[0]?.months.map((m) => (
                <th key={m.label} className="text-center text-xs font-medium text-gray-500 pb-2 min-w-[70px]">
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapData.map((row) => (
              <tr key={row.person.id} className="group">
                <td className="py-1 pr-4">
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:text-[#C8A951] transition-colors"
                    onClick={() => onPersonClick(row.person.id)}
                  >
                    <Avatar name={row.person.name} size="sm" />
                    <span className="text-xs font-medium text-gray-700 group-hover:text-[#C8A951] truncate">{row.person.name}</span>
                  </div>
                </td>
                {row.months.map((m, idx) => (
                  <td key={idx} className="py-1 px-0.5 relative">
                    <div
                      className="h-8 rounded flex items-center justify-center text-[11px] font-semibold cursor-pointer transition-all hover:scale-105 hover:shadow-sm"
                      style={{
                        backgroundColor: getCapacityColor(m.utilization),
                        color: getCapacityTextColor(m.utilization),
                      }}
                      onMouseEnter={() => setHoveredCell({ personId: row.person.id, monthIdx: idx })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {m.utilization > 0 ? `${Math.round(m.utilization)}%` : "—"}
                    </div>
                    {hoveredCell?.personId === row.person.id && hoveredCell?.monthIdx === idx && m.utilization > 0 && (
                      <div className="absolute z-10 top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-900 text-white text-[10px] rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                        {getTooltipContent(row.person.id, idx).map((item, i) => (
                          <div key={i}>{item.projectName} — {item.role} ({item.hours}h)</div>
                        ))}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">Terhelés:</span>
        {[
          { label: "<60%", color: "#D1FAE5" },
          { label: "60–80%", color: "#FEF3C7" },
          { label: "80–100%", color: "#FDE68A" },
          { label: ">100%", color: "#FCA5A5" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div className="w-4 h-3 rounded" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
