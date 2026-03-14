import { useAppStore } from "../../store/appStore";
import { PIPELINE_ORDER, PipelineStatus, PipelineStatusLabels, PipelineStatusColors } from "../../types/project";
import { ProjectCard } from "./ProjectCard";
import { formatCurrency } from "../../utils/format";

interface ProjectKanbanProps {
  onProjectClick: (id: string) => void;
  searchQuery: string;
}

export function ProjectKanban({ onProjectClick, searchQuery }: ProjectKanbanProps) {
  const { projects, updateProject } = useAppStore();

  const allStatuses = [...PIPELINE_ORDER, PipelineStatus.LOST, PipelineStatus.ON_HOLD];

  const columns = allStatuses.map((status) => {
    let statusProjects = projects.filter((p) => p.status === status);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      statusProjects = statusProjects.filter(
        (p) => p.company.toLowerCase().includes(q) || p.projectName.toLowerCase().includes(q)
      );
    }
    const total = statusProjects.reduce((s, p) => s + p.weightedRevenue, 0);
    return { status, projects: statusProjects, total };
  });

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    e.dataTransfer.setData("projectId", projectId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStatus: PipelineStatus) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData("projectId");
    if (projectId) {
      const defaultProb: Record<string, number> = {
        lead: 10, qualification: 20, proposal: 35, submitted: 50, negotiation: 70,
        won: 90, active: 95, completed: 100, lost: 0, on_hold: 25,
      };
      const probability = defaultProb[targetStatus] ?? 50;
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        updateProject(projectId, {
          status: targetStatus,
          probability,
          weightedRevenue: project.expectedRevenue * (probability / 100),
        });
      }
    }
  };

  return (
    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 items-start">
      {columns.map((col) => (
        <div
          key={col.status}
          className="flex-shrink-0 w-64 sm:w-72"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, col.status)}
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PipelineStatusColors[col.status] }} />
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                {PipelineStatusLabels[col.status]}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {col.projects.length}
              </span>
            </div>
            <span className="text-xs text-gray-400 font-medium">{formatCurrency(col.total)}</span>
          </div>
          <div className="space-y-3 min-h-[60px] p-1 rounded-lg bg-gray-50/50">
            {col.projects.map((project) => (
              <div
                key={project.id}
                draggable
                onDragStart={(e) => handleDragStart(e, project.id)}
              >
                <ProjectCard project={project} onClick={() => onProjectClick(project.id)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
