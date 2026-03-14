import { useState } from "react";
import { Drawer } from "../../ui/Drawer";
import { useAppStore } from "../../../store/appStore";
import { ProjectBasicForm } from "./ProjectBasicForm";
import { ProjectTeamTab } from "./ProjectTeamTab";
import { ProjectDocsTab } from "./ProjectDocsTab";

interface ProjectDrawerProps {
  projectId: string | null;
  open: boolean;
  onClose: () => void;
}

export function ProjectDrawer({ projectId, open, onClose }: ProjectDrawerProps) {
  const { projects } = useAppStore();
  const [tab, setTab] = useState<"basic" | "team" | "docs">("basic");

  const project = projects.find((p) => p.id === projectId);
  if (!project && open) return null;

  return (
    <Drawer open={open} onClose={onClose} title={project?.projectName ?? "Projekt"} width="max-w-2xl">
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            { key: "basic" as const, label: "Alapadatok" },
            { key: "team" as const, label: "Csapat" },
            { key: "docs" as const, label: "Dokumentumok" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                tab === t.key
                  ? "border-[#C8A951] text-[#C8A951]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {project && (
        <div className="p-4 sm:p-6">
          {tab === "basic" && <ProjectBasicForm project={project} />}
          {tab === "team" && <ProjectTeamTab project={project} />}
          {tab === "docs" && <ProjectDocsTab project={project} />}
        </div>
      )}
    </Drawer>
  );
}
