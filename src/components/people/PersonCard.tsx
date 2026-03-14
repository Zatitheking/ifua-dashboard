import { Briefcase, Clock, Tag } from "lucide-react";
import { type Person, PersonRoleLabels, PersonRoleBadgeColors, CompetencyCenterLabels } from "../../types/person";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { ProgressBar } from "../ui/ProgressBar";

interface PersonCardProps {
  person: Person;
  utilization: number;
  activeProjects: number;
  allocatedHours: number;
  onClick: () => void;
}

export function PersonCard({ person, utilization, activeProjects, allocatedHours, onClick }: PersonCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={person.name} size="lg" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">{person.name}</h4>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border mt-1 ${PersonRoleBadgeColors[person.role]}`}>
            {PersonRoleLabels[person.role]}
          </span>
          {person.competencyCenter && (
            <div className="text-xs text-gray-500 mt-0.5">{CompetencyCenterLabels[person.competencyCenter]}</div>
          )}
          {person.isExternal && person.externalOrg && (
            <div className="text-xs text-orange-600 mt-0.5">{person.externalOrg}</div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Kihasználtság</span>
          <span className="font-medium">{Math.round(utilization)}%</span>
        </div>
        <ProgressBar value={utilization} showLabel={false} />
      </div>

      <div className="space-y-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Briefcase size={12} />
          <span>{activeProjects} aktív projekt</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} />
          <span>{allocatedHours} h/hét allokálva ({person.availableHoursPerWeek}-ből)</span>
        </div>
      </div>

      {person.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
          {person.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-[10px]">{skill}</Badge>
          ))}
          {person.skills.length > 3 && (
            <span className="text-[10px] text-gray-400 self-center">+{person.skills.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
}
