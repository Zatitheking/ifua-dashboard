import { Building2, Calendar, Users } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { type Project, PipelineStatusColors, PipelineStatusLabels, IndustryLabels, ProjectTypeLabels } from "../../types/project";
import { Avatar } from "../ui/Avatar";
import { Badge, StatusBadge } from "../ui/Badge";
import { formatCurrency, formatDateShort } from "../../utils/format";
import { getProjectTeamStats } from "../../utils/capacity";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  isDragging?: boolean;
}

export function ProjectCard({ project, onClick, isDragging }: ProjectCardProps) {
  const { persons, assignments } = useAppStore();
  const team = getProjectTeamStats(project.id, assignments, persons);
  const sponsor = project.sponsorId ? persons.find((p) => p.id === project.sponsorId) : null;
  const pm = project.projectManagerId ? persons.find((p) => p.id === project.projectManagerId) : null;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all ${
        isDragging ? "shadow-lg ring-2 ring-[#C8A951]/30 rotate-1" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={14} className="text-gray-400 shrink-0" />
            <span className="text-xs font-medium text-gray-500 truncate">{project.company}</span>
          </div>
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{project.projectName}</h4>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Badge className="text-[10px]">{IndustryLabels[project.industry]}</Badge>
        <Badge className="text-[10px]">{ProjectTypeLabels[project.projectType]}</Badge>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-bold text-gray-900">{formatCurrency(project.expectedRevenue)}</span>
        <span className="text-xs text-gray-500">
          {project.probability}% → {formatCurrency(project.weightedRevenue)}
        </span>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
        <Calendar size={12} />
        <span>{formatDateShort(project.startDate)} – {formatDateShort(project.endDate)}</span>
      </div>

      {(sponsor || pm || team.teamSize > 0) && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center -space-x-1.5">
            {sponsor && <Avatar name={sponsor.name} size="sm" />}
            {pm && <Avatar name={pm.name} size="sm" />}
            {team.teamSize > 2 && (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600 border-2 border-white">
                +{team.teamSize - 2}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Users size={12} />
            <span>{team.teamSize} fő{team.externalCount > 0 ? ` (${team.externalCount} külső)` : ""}</span>
          </div>
        </div>
      )}
    </div>
  );
}
