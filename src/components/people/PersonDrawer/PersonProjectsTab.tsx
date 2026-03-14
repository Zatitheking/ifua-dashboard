import { useAppStore } from "../../../store/appStore";
import { type Person } from "../../../types/person";
import { AssignmentRoleLabels } from "../../../types/assignment";
import { PipelineStatusLabels, PipelineStatusColors } from "../../../types/project";
import { StatusBadge } from "../../ui/Badge";
import { ProgressBar } from "../../ui/ProgressBar";
import { formatDateShort } from "../../../utils/format";

interface PersonProjectsTabProps {
  person: Person;
}

export function PersonProjectsTab({ person }: PersonProjectsTabProps) {
  const { projects, assignments } = useAppStore();

  const personAssignments = assignments
    .filter((a) => a.personId === person.id)
    .map((a) => {
      const project = projects.find((p) => p.id === a.projectId);
      return { assignment: a, project };
    })
    .filter((item) => item.project)
    .sort((a, b) => new Date(b.assignment.startDate).getTime() - new Date(a.assignment.startDate).getTime());

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
        {personAssignments.length} projekt
      </div>

      {personAssignments.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">Nincs hozzárendelt projekt</div>
      ) : (
        <div className="space-y-2">
          {personAssignments.map(({ assignment, project }) => (
            <div key={assignment.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{project!.company}</div>
                  <div className="text-xs text-gray-600">{project!.projectName}</div>
                </div>
                <StatusBadge color={PipelineStatusColors[project!.status]} label={PipelineStatusLabels[project!.status]} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-3">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase">Szerep</div>
                  <div className="text-xs font-medium text-gray-700">{AssignmentRoleLabels[assignment.assignmentRole]}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase">Allokáció</div>
                  <div className="text-xs font-medium text-gray-700">{assignment.allocatedHoursPerWeek}h/hét ({Math.round(assignment.allocationPercent)}%)</div>
                  <ProgressBar value={assignment.allocationPercent} size="sm" showLabel={false} className="mt-1" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase">Időszak</div>
                  <div className="text-xs text-gray-700">
                    {formatDateShort(assignment.startDate)} – {formatDateShort(assignment.endDate)}
                  </div>
                </div>
              </div>
              {assignment.notes && (
                <div className="mt-2 text-xs text-gray-500 italic">{assignment.notes}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
