import { useState } from "react";
import { Drawer } from "../../ui/Drawer";
import { useAppStore } from "../../../store/appStore";
import { PersonBasicForm } from "./PersonBasicForm";
import { PersonProjectsTab } from "./PersonProjectsTab";
import { PersonStatsTab } from "./PersonStatsTab";

interface PersonDrawerProps {
  personId: string | null;
  open: boolean;
  onClose: () => void;
}

export function PersonDrawer({ personId, open, onClose }: PersonDrawerProps) {
  const { persons } = useAppStore();
  const [tab, setTab] = useState<"basic" | "projects" | "stats">("basic");

  const person = persons.find((p) => p.id === personId);
  if (!person && open) return null;

  return (
    <Drawer open={open} onClose={onClose} title={person?.name ?? "Személy"} width="max-w-2xl">
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            { key: "basic" as const, label: "Alapadatok" },
            { key: "projects" as const, label: "Projektek" },
            { key: "stats" as const, label: "Statisztikák" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
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
      {person && (
        <div className="p-6">
          {tab === "basic" && <PersonBasicForm person={person} />}
          {tab === "projects" && <PersonProjectsTab person={person} />}
          {tab === "stats" && <PersonStatsTab person={person} />}
        </div>
      )}
    </Drawer>
  );
}
