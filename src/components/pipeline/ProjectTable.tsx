import { useState, useMemo } from "react";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { PipelineStatus, PipelineStatusLabels, PipelineStatusColors, IndustryLabels, ProjectTypeLabels, type Project } from "../../types/project";
import { StatusBadge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { formatCurrency, formatDateShort } from "../../utils/format";
import { getProjectTeamStats } from "../../utils/capacity";

interface ProjectTableProps {
  onProjectClick: (id: string) => void;
  statusFilter: PipelineStatus | "all";
  searchQuery: string;
}

type SortKey = "company" | "projectName" | "expectedRevenue" | "weightedRevenue" | "probability" | "status" | "startDate";

export function ProjectTable({ onProjectClick, statusFilter, searchQuery }: ProjectTableProps) {
  const { projects, persons, assignments } = useAppStore();
  const [sortKey, setSortKey] = useState<SortKey>("expectedRevenue");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let list = [...projects];
    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.company.toLowerCase().includes(q) ||
          p.projectName.toLowerCase().includes(q) ||
          IndustryLabels[p.industry].toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "expectedRevenue" || sortKey === "weightedRevenue" || sortKey === "probability") {
        cmp = (a[sortKey] as number) - (b[sortKey] as number);
      } else {
        cmp = String(a[sortKey]).localeCompare(String(b[sortKey]), "hu");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [projects, statusFilter, searchQuery, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={12} className="text-gray-300" />;
    return sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {[
                { key: "company" as SortKey, label: "Ügyfél" },
                { key: "projectName" as SortKey, label: "Projekt" },
                { key: "status" as SortKey, label: "Státusz" },
                { key: "expectedRevenue" as SortKey, label: "Várható bevétel" },
                { key: "probability" as SortKey, label: "Valószínűség" },
                { key: "weightedRevenue" as SortKey, label: "Súlyozott" },
                { key: "startDate" as SortKey, label: "Időszak" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Csapat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((project) => {
              const team = getProjectTeamStats(project.id, assignments, persons);
              const sponsor = project.sponsorId ? persons.find((p) => p.id === project.sponsorId) : null;
              const pm = project.projectManagerId ? persons.find((p) => p.id === project.projectManagerId) : null;

              return (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onProjectClick(project.id)}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{project.company}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{project.projectName}</td>
                  <td className="px-4 py-3">
                    <StatusBadge color={PipelineStatusColors[project.status]} label={PipelineStatusLabels[project.status]} />
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 tabular-nums">{formatCurrency(project.expectedRevenue)}</td>
                  <td className="px-4 py-3 tabular-nums">{project.probability}%</td>
                  <td className="px-4 py-3 font-semibold tabular-nums text-emerald-700">{formatCurrency(project.weightedRevenue)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {formatDateShort(project.startDate)} – {formatDateShort(project.endDate)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center -space-x-1">
                      {sponsor && <Avatar name={sponsor.name} size="sm" />}
                      {pm && <Avatar name={pm.name} size="sm" />}
                      {team.teamSize > 2 && (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">
                          +{team.teamSize - 2}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <div className="py-12 text-center text-gray-400 text-sm">Nincs találat a szűrőknek megfelelően</div>
      )}
    </div>
  );
}
