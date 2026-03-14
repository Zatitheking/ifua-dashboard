import { useState } from "react";
import { TopBar } from "../components/layout/TopBar";
import { useAppStore } from "../store/appStore";
import { PipelineStatus, PipelineStatusLabels, PipelineStatusColors, ProjectTypeLabels } from "../types/project";
import { PersonRoleLabels } from "../types/person";
import { AssignmentRoleLabels } from "../types/assignment";
import { formatCurrency, formatCurrencyFull, formatDate, getInitials, getAvatarColor } from "../utils/format";
import { Badge, StatusBadge } from "../components/ui/Badge";
import { ProjectDrawer } from "../components/pipeline/ProjectDrawer/ProjectDrawer";

export function ProjectManagerView() {
  const { projects, persons, assignments } = useAppStore();
  const [selectedPmId, setSelectedPmId] = useState("p3");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const pms = persons.filter((p) => ["project_manager", "partner", "sponsor"].includes(p.role));
  const pm = persons.find((p) => p.id === selectedPmId);

  const managedProjects = projects.filter((p) => p.projectManagerId === selectedPmId);
  const activeManaged = managedProjects.filter((p) =>
    [PipelineStatus.ACTIVE, PipelineStatus.WON].includes(p.status)
  );
  const upcomingManaged = managedProjects.filter((p) =>
    [PipelineStatus.NEGOTIATION, PipelineStatus.SUBMITTED, PipelineStatus.PROPOSAL].includes(p.status)
  );

  const totalActiveRevenue = activeManaged.reduce((s, p) => s + p.expectedRevenue, 0);
  const totalActiveHours = activeManaged.reduce((s, p) => {
    return s + assignments.filter((a) => a.projectId === p.id).reduce((h, a) => h + a.allocatedHoursPerWeek, 0);
  }, 0);

  return (
    <>
      <TopBar title="Projektmenedzser Nézet" subtitle="Projekt portfólió és csapat kezelés" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {/* PM selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-sm font-medium text-gray-500">PM:</label>
          <select
            value={selectedPmId}
            onChange={(e) => setSelectedPmId(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]"
          >
            {pms.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Aktív projektek", value: String(activeManaged.length), color: "text-emerald-600" },
            { label: "Aktív bevétel", value: formatCurrency(totalActiveRevenue), color: "text-gray-900" },
            { label: "Pipeline projektek", value: String(upcomingManaged.length), color: "text-blue-600" },
            { label: "Csapat kapacitás", value: `${totalActiveHours}h/hét`, color: "text-amber-600" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{kpi.label}</div>
              <div className={`text-xl sm:text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Active project cards */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Aktív projektek</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeManaged.map((p) => {
              const team = assignments.filter((a) => a.projectId === p.id);
              const teamPersons = team.map((a) => persons.find((pe) => pe.id === a.personId)).filter(Boolean);
              const sponsor = persons.find((pe) => pe.id === p.sponsorId);
              const totalHours = team.reduce((s, a) => s + a.allocatedHoursPerWeek, 0);
              const daysLeft = Math.ceil((new Date(p.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedProjectId(p.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-base font-semibold text-gray-900">{p.company}</div>
                      <div className="text-sm text-gray-500">{p.projectName}</div>
                    </div>
                    <StatusBadge color={PipelineStatusColors[p.status]} label={PipelineStatusLabels[p.status]} />
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs font-bold text-gray-900">{formatCurrency(p.expectedRevenue)}</div>
                      <div className="text-[10px] text-gray-400">Bevétel</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs font-bold text-gray-900">{team.length} fő</div>
                      <div className="text-[10px] text-gray-400">Csapat</div>
                    </div>
                    <div className={`rounded-lg p-2 ${daysLeft < 60 ? "bg-red-50" : "bg-gray-50"}`}>
                      <div className={`text-xs font-bold ${daysLeft < 60 ? "text-red-600" : "text-gray-900"}`}>{daysLeft} nap</div>
                      <div className="text-[10px] text-gray-400">Hátralévő</div>
                    </div>
                  </div>

                  {/* Timeline bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>{formatDate(p.startDate)}</span>
                      <span>{formatDate(p.endDate)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C8A951] rounded-full"
                        style={{
                          width: `${Math.min(100, Math.max(0, ((Date.now() - new Date(p.startDate).getTime()) / (new Date(p.endDate).getTime() - new Date(p.startDate).getTime())) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Team avatars */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400 mr-1">Csapat:</span>
                    {teamPersons.slice(0, 5).map((pe) => (
                      <div
                        key={pe!.id}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold -ml-1 first:ml-0 border border-white"
                        style={{ backgroundColor: getAvatarColor(pe!.name) }}
                        title={pe!.name}
                      >
                        {getInitials(pe!.name)}
                      </div>
                    ))}
                    {teamPersons.length > 5 && (
                      <span className="text-[10px] text-gray-400 ml-1">+{teamPersons.length - 5}</span>
                    )}
                    {sponsor && (
                      <span className="text-[10px] text-gray-400 ml-auto">Szponzor: {sponsor.name}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming / Pipeline */}
        {upcomingManaged.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Pipeline projektek ({upcomingManaged.length})</h3>
            <div className="space-y-2">
              {upcomingManaged.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedProjectId(p.id)}
                >
                  <StatusBadge color={PipelineStatusColors[p.status]} label={PipelineStatusLabels[p.status]} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{p.company} — {p.projectName}</div>
                    <div className="text-[10px] text-gray-400">{p.probability}% · {formatDate(p.startDate)} - {formatDate(p.endDate)}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{formatCurrency(p.weightedRevenue)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team hours breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Csapat allokáció (aktív projektek)</h3>
          <div className="space-y-2">
            {activeManaged.map((p) => {
              const team = assignments.filter((a) => a.projectId === p.id);
              return (
                <div key={p.id}>
                  <div className="text-xs font-medium text-gray-700 mb-1">{p.company}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {team.map((a) => {
                      const person = persons.find((pe) => pe.id === a.personId);
                      return (
                        <div key={a.id} className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md text-[10px]">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                            style={{ backgroundColor: getAvatarColor(person?.name ?? "") }}
                          >
                            {getInitials(person?.name ?? "")}
                          </div>
                          <span className="text-gray-700">{person?.name}</span>
                          <span className="text-gray-400">{a.allocatedHoursPerWeek}h · {AssignmentRoleLabels[a.assignmentRole]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ProjectDrawer
        projectId={selectedProjectId}
        open={selectedProjectId !== null}
        onClose={() => setSelectedProjectId(null)}
      />
    </>
  );
}
