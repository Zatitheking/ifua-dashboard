import { useState } from "react";
import { TopBar } from "../components/layout/TopBar";
import { useAppStore } from "../store/appStore";
import { PipelineStatus, PipelineStatusLabels, PipelineStatusColors, ProjectTypeLabels } from "../types/project";
import { PersonRoleLabels, CompetencyCenterLabels } from "../types/person";
import { AssignmentRoleLabels } from "../types/assignment";
import { formatCurrency, formatCurrencyFull, formatDate, getInitials, getAvatarColor } from "../utils/format";
import { Badge, StatusBadge } from "../components/ui/Badge";
import { ProjectDrawer } from "../components/pipeline/ProjectDrawer/ProjectDrawer";

export function SponsorView() {
  const { projects, persons, assignments } = useAppStore();
  const [selectedSponsorId, setSelectedSponsorId] = useState("p1");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const sponsors = persons.filter((p) => ["partner", "sponsor"].includes(p.role));
  const sponsor = persons.find((p) => p.id === selectedSponsorId);

  const sponsoredProjects = projects.filter((p) => p.sponsorId === selectedSponsorId);
  const activeProjects = sponsoredProjects.filter((p) =>
    [PipelineStatus.ACTIVE, PipelineStatus.WON, PipelineStatus.NEGOTIATION].includes(p.status)
  );
  const pipelineProjects = sponsoredProjects.filter((p) =>
    [PipelineStatus.LEAD, PipelineStatus.QUALIFICATION, PipelineStatus.PROPOSAL, PipelineStatus.SUBMITTED].includes(p.status)
  );

  const totalExpected = sponsoredProjects.reduce((s, p) => s + p.expectedRevenue, 0);
  const totalWeighted = sponsoredProjects.reduce((s, p) => s + p.weightedRevenue, 0);
  const activeRevenue = activeProjects.reduce((s, p) => s + p.expectedRevenue, 0);
  const pipelineWeighted = pipelineProjects.reduce((s, p) => s + p.weightedRevenue, 0);
  const winRate = sponsoredProjects.length > 0
    ? Math.round(
        (sponsoredProjects.filter((p) => [PipelineStatus.WON, PipelineStatus.ACTIVE, PipelineStatus.COMPLETED].includes(p.status)).length /
          sponsoredProjects.filter((p) => p.status !== PipelineStatus.LEAD).length) * 100
      )
    : 0;

  // Unique team members across all sponsored projects
  const teamPersonIds = new Set<string>();
  sponsoredProjects.forEach((p) => {
    assignments.filter((a) => a.projectId === p.id).forEach((a) => teamPersonIds.add(a.personId));
  });
  const teamMembers = persons.filter((p) => teamPersonIds.has(p.id));

  return (
    <>
      <TopBar title="Szponzor / CC Vezetői Nézet" subtitle="Portfólió áttekintés és csapatkapacitás" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {/* Sponsor selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-sm font-medium text-gray-500">Szponzor:</label>
          <select
            value={selectedSponsorId}
            onChange={(e) => setSelectedSponsorId(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]"
          >
            {sponsors.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — {PersonRoleLabels[s.role]}</option>
            ))}
          </select>
          {sponsor && sponsor.competencyCenter && (
            <Badge>{CompetencyCenterLabels[sponsor.competencyCenter]}</Badge>
          )}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: "Projektek", value: String(sponsoredProjects.length), sub: `${activeProjects.length} aktív` },
            { label: "Összesített bevétel", value: formatCurrency(totalExpected), sub: "elvárt" },
            { label: "Súlyozott bevétel", value: formatCurrency(totalWeighted), sub: "pipeline + aktív" },
            { label: "Pipeline bevétel", value: formatCurrency(pipelineWeighted), sub: "súlyozott" },
            { label: "Win Rate", value: `${winRate}%`, sub: "zárt lehetőségek" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{kpi.label}</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{kpi.value}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Project status breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Projekt portfólió státusz szerint</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.values(PipelineStatus).map((status) => {
              const count = sponsoredProjects.filter((p) => p.status === status).length;
              if (count === 0) return null;
              const revenue = sponsoredProjects.filter((p) => p.status === status).reduce((s, p) => s + p.weightedRevenue, 0);
              return (
                <div key={status} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PipelineStatusColors[status] }} />
                  <div>
                    <div className="text-xs font-medium text-gray-700">{PipelineStatusLabels[status]} ({count})</div>
                    <div className="text-[10px] text-gray-400">{formatCurrency(revenue)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active & Won projects */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Aktív és megnyert projektek ({activeProjects.length})</h3>
          <div className="space-y-3">
            {activeProjects.map((p) => {
              const pm = persons.find((pe) => pe.id === p.projectManagerId);
              const teamCount = assignments.filter((a) => a.projectId === p.id).length;
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedProjectId(p.id)}
                >
                  <StatusBadge color={PipelineStatusColors[p.status]} label={PipelineStatusLabels[p.status]} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900">{p.company}</div>
                    <div className="text-xs text-gray-500 truncate">{p.projectName}</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-semibold text-gray-900">{formatCurrencyFull(p.expectedRevenue)}</div>
                    <div className="text-[10px] text-gray-400">PM: {pm?.name ?? "—"} · {teamCount} fő</div>
                  </div>
                  <div className="text-right sm:hidden">
                    <div className="text-xs font-semibold">{formatCurrency(p.expectedRevenue)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline projects */}
        {pipelineProjects.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Pipeline ({pipelineProjects.length})</h3>
            <div className="space-y-2">
              {pipelineProjects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedProjectId(p.id)}
                >
                  <StatusBadge color={PipelineStatusColors[p.status]} label={PipelineStatusLabels[p.status]} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{p.company} — {p.projectName}</div>
                    <div className="text-[10px] text-gray-400">{ProjectTypeLabels[p.projectType]} · {p.probability}% · {formatDate(p.startDate)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(p.weightedRevenue)}</div>
                    <div className="text-[10px] text-gray-400">súlyozott</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Csapatomban ({teamMembers.length} fő)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {teamMembers.map((m) => {
              const memberAssignments = assignments.filter((a) => {
                const proj = sponsoredProjects.find((p) => p.id === a.projectId);
                return a.personId === m.id && proj;
              });
              const totalHours = memberAssignments.reduce((s, a) => s + a.allocatedHoursPerWeek, 0);
              return (
                <div key={m.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: getAvatarColor(m.name) }}
                  >
                    {getInitials(m.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-gray-900 truncate">{m.name}</div>
                    <div className="text-[10px] text-gray-400">{PersonRoleLabels[m.role]} · {totalHours}h/hét · {memberAssignments.length} projekt</div>
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
