import { TopBar } from "../components/layout/TopBar";
import { CompetencyCenter, CompetencyCenterLabels, PersonRole, PersonRoleLabels, PersonRoleBadgeColors } from "../types/person";
import { PipelineStatus, PipelineStatusLabels, PipelineStatusColors, PipelineStatusDefaults } from "../types/project";
import { AssignmentRole, AssignmentRoleLabels, AssignmentRoleColors } from "../types/assignment";
import { useAppStore } from "../store/appStore";
import { Button } from "../components/ui/Button";
import { RotateCcw, Download } from "lucide-react";
import * as XLSX from "xlsx";

export function SettingsPage() {
  const { projects, persons, assignments, resetToSeed } = useAppStore();

  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    const projectsData = projects.map((p) => ({
      Ügyfél: p.company,
      Projekt: p.projectName,
      Státusz: PipelineStatusLabels[p.status],
      "Várható bevétel": p.expectedRevenue,
      "Valószínűség (%)": p.probability,
      "Súlyozott bevétel": p.weightedRevenue,
      Kezdés: p.startDate,
      Befejezés: p.endDate,
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(projectsData), "Projektek");

    const personsData = persons.map((p) => ({
      Név: p.name,
      Email: p.email,
      Szerepkör: PersonRoleLabels[p.role],
      CC: p.competencyCenter ? CompetencyCenterLabels[p.competencyCenter] : "Külső",
      "Heti kapacitás": p.availableHoursPerWeek,
      Skillek: p.skills.join(", "),
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(personsData), "Csapat");

    XLSX.writeFile(wb, "IFUA_Pipeline_Export.xlsx");
  };

  return (
    <>
      <TopBar title="Beállítások" subtitle="Rendszer konfiguráció és export" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Műveletek</h3>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleExport}>
              <Download size={16} /> Excel export
            </Button>
            <Button variant="danger" onClick={resetToSeed}>
              <RotateCcw size={16} /> Adatok visszaállítása (seed)
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Az adatok a böngésző localStorage-jában tárolódnak.</p>
        </div>

        {/* Pipeline status reference */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Pipeline státuszok</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(PipelineStatus).map((s) => (
              <div key={s} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PipelineStatusColors[s] }} />
                <span className="text-sm font-medium text-gray-700 flex-1">{PipelineStatusLabels[s]}</span>
                <span className="text-xs text-gray-400">Default: {PipelineStatusDefaults[s]}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Competency Centers */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Kompetenciaközpontok</h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(CompetencyCenter).map((cc) => (
              <div key={cc} className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-sm font-medium text-gray-700">{CompetencyCenterLabels[cc]}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {persons.filter((p) => p.competencyCenter === cc && p.isActive).length} fő
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role types */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Szerepkörök</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Személy szerepkörök</h4>
              <div className="space-y-1">
                {Object.values(PersonRole).map((r) => (
                  <div key={r} className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${PersonRoleBadgeColors[r]}`}>
                      {PersonRoleLabels[r]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Projekt hozzárendelési szerepek</h4>
              <div className="space-y-1">
                {Object.values(AssignmentRole).map((r) => (
                  <div key={r} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: AssignmentRoleColors[r] }} />
                    <span className="text-sm text-gray-700">{AssignmentRoleLabels[r]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Rendszer statisztika</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Projektek", value: projects.length },
              { label: "Személyek", value: persons.length },
              { label: "Hozzárendelések", value: assignments.length },
              { label: "Aktív személyek", value: persons.filter((p) => p.isActive).length },
            ].map((stat) => (
              <div key={stat.label} className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
