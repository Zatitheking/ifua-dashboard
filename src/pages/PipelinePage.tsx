import { useState } from "react";
import { LayoutGrid, List, Plus, Search } from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { ProjectTable } from "../components/pipeline/ProjectTable";
import { ProjectKanban } from "../components/pipeline/ProjectKanban";
import { ProjectDrawer } from "../components/pipeline/ProjectDrawer/ProjectDrawer";
import { Button } from "../components/ui/Button";
import { PipelineStatus, PipelineStatusLabels, PipelineStatusDefaults } from "../types/project";
import { useAppStore } from "../store/appStore";
import { Industry, ProjectType } from "../types/project";

export function PipelinePage() {
  const { addProject, projects } = useAppStore();
  const [view, setView] = useState<"table" | "kanban">("kanban");
  const [statusFilter, setStatusFilter] = useState<PipelineStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleNewProject = () => {
    const id = `pr_${Date.now()}`;
    addProject({
      id,
      company: "",
      industry: Industry.IT,
      projectName: "Új projekt",
      projectType: ProjectType.STRATEGY,
      status: PipelineStatus.LEAD,
      expectedRevenue: 0,
      probability: PipelineStatusDefaults[PipelineStatus.LEAD],
      weightedRevenue: 0,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      sponsorId: null,
      projectManagerId: null,
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setSelectedProjectId(id);
  };

  return (
    <>
      <TopBar title="Pipeline" subtitle={`${projects.length} projekt a rendszerben`} />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Projekt keresése..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951] w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PipelineStatus | "all")}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]"
            >
              <option value="all">Minden státusz</option>
              {Object.values(PipelineStatus).map((s) => (
                <option key={s} value={s}>{PipelineStatusLabels[s]}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setView("kanban")}
                className={`px-3 py-2 text-sm cursor-pointer ${view === "kanban" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setView("table")}
                className={`px-3 py-2 text-sm cursor-pointer ${view === "table" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                <List size={16} />
              </button>
            </div>
            <Button onClick={handleNewProject}>
              <Plus size={16} /> Új projekt
            </Button>
          </div>
        </div>

        {/* Content */}
        {view === "kanban" ? (
          <ProjectKanban onProjectClick={setSelectedProjectId} searchQuery={searchQuery} />
        ) : (
          <ProjectTable onProjectClick={setSelectedProjectId} statusFilter={statusFilter} searchQuery={searchQuery} />
        )}
      </div>

      <ProjectDrawer
        projectId={selectedProjectId}
        open={selectedProjectId !== null}
        onClose={() => setSelectedProjectId(null)}
      />
    </>
  );
}
