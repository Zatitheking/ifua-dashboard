import { useState } from "react";
import { TopBar } from "../components/layout/TopBar";
import { useAppStore } from "../store/appStore";
import { PipelineStatus, PipelineStatusLabels, PipelineStatusColors, ProjectTypeLabels } from "../types/project";
import { PersonRoleLabels, CompetencyCenterLabels } from "../types/person";
import { AssignmentRoleLabels, AssignmentRoleColors } from "../types/assignment";
import { formatCurrency, formatDate, getInitials, getAvatarColor } from "../utils/format";
import { Badge, StatusBadge } from "../components/ui/Badge";
import { getUtilizationForMonth, getCapacityColor, getCapacityTextColor } from "../utils/capacity";
import { addMonths, format } from "date-fns";
import { hu } from "date-fns/locale";
import { Star } from "lucide-react";

export function TeamMemberView() {
  const { projects, persons, assignments, evaluations } = useAppStore();
  const [selectedPersonId, setSelectedPersonId] = useState("p10");

  const consultants = persons.filter((p) => !["partner", "sponsor"].includes(p.role) && p.isActive);
  const person = persons.find((p) => p.id === selectedPersonId);

  const myAssignments = assignments.filter((a) => a.personId === selectedPersonId);
  const activeAssignments = myAssignments.filter((a) => {
    const project = projects.find((p) => p.id === a.projectId);
    return project && [PipelineStatus.ACTIVE, PipelineStatus.WON].includes(project.status);
  });
  const totalHoursWeek = activeAssignments.reduce((s, a) => s + a.allocatedHoursPerWeek, 0);
  const utilization = person ? (totalHoursWeek / person.availableHoursPerWeek) * 100 : 0;
  const freeHours = person ? Math.max(0, person.availableHoursPerWeek - totalHoursWeek) : 0;

  const myEvals = evaluations.filter((e) => e.personId === selectedPersonId);
  const avgRating = myEvals.length > 0 ? myEvals.reduce((s, e) => s + e.rating, 0) / myEvals.length : 0;

  // 6-month capacity timeline
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => addMonths(now, i));

  return (
    <>
      <TopBar title="Csapattag Nézet" subtitle="Személyes munkaterhelés és projektek" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {/* Person selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-sm font-medium text-gray-500">Személy:</label>
          <select
            value={selectedPersonId}
            onChange={(e) => setSelectedPersonId(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]"
          >
            {consultants.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — {PersonRoleLabels[p.role]}</option>
            ))}
          </select>
        </div>

        {person && (
          <>
            {/* Personal info + KPIs */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
                  style={{ backgroundColor: getAvatarColor(person.name) }}
                >
                  {getInitials(person.name)}
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{person.name}</div>
                  <div className="text-sm text-gray-500">
                    {PersonRoleLabels[person.role]}
                    {person.competencyCenter && ` · ${CompetencyCenterLabels[person.competencyCenter]}`}
                  </div>
                  {person.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {person.skills.slice(0, 4).map((s) => (
                        <Badge key={s} className="text-[9px]">{s}</Badge>
                      ))}
                      {person.skills.length > 4 && <span className="text-[10px] text-gray-400">+{person.skills.length - 4}</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className={`text-xl font-bold ${utilization > 100 ? "text-red-600" : utilization > 80 ? "text-amber-600" : "text-emerald-600"}`}>
                    {Math.round(utilization)}%
                  </div>
                  <div className="text-[10px] text-gray-400">Kihasználtság</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-gray-900">{totalHoursWeek}h</div>
                  <div className="text-[10px] text-gray-400">Allokált / hét</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className={`text-xl font-bold ${freeHours === 0 ? "text-red-600" : "text-emerald-600"}`}>{freeHours}h</div>
                  <div className="text-[10px] text-gray-400">Szabad kapacitás</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star size={16} className={avgRating > 0 ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                    <span className="text-xl font-bold text-gray-900">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</span>
                  </div>
                  <div className="text-[10px] text-gray-400">Átl. értékelés ({myEvals.length})</div>
                </div>
              </div>
            </div>

            {/* Capacity timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Kapacitás előrejelzés (6 hónap)</h3>
              <div className="flex gap-2">
                {months.map((m) => {
                  const record = getUtilizationForMonth(selectedPersonId, m, assignments, persons);
                  const bgColor = getCapacityColor(record.utilizationPercent);
                  const textColor = getCapacityTextColor(record.utilizationPercent);
                  return (
                    <div key={m.toISOString()} className="flex-1 text-center">
                      <div className="text-[10px] text-gray-400 mb-1">{format(m, "MMM", { locale: hu })}</div>
                      <div
                        className="rounded-lg py-3 text-xs font-bold"
                        style={{ backgroundColor: bgColor, color: textColor }}
                      >
                        {Math.round(record.utilizationPercent)}%
                      </div>
                      <div className="text-[9px] text-gray-400 mt-0.5">{record.totalAllocatedHours}h</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* My active assignments */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Aktív projektjeim ({activeAssignments.length})</h3>
              <div className="space-y-3">
                {activeAssignments.map((a) => {
                  const project = projects.find((p) => p.id === a.projectId);
                  if (!project) return null;
                  const pm = persons.find((pe) => pe.id === project.projectManagerId);
                  const daysLeft = Math.ceil((new Date(project.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  const progress = Math.min(100, Math.max(0, ((Date.now() - new Date(project.startDate).getTime()) / (new Date(project.endDate).getTime() - new Date(project.startDate).getTime())) * 100));
                  return (
                    <div key={a.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{project.company}</div>
                          <div className="text-xs text-gray-500">{project.projectName}</div>
                        </div>
                        <StatusBadge color={PipelineStatusColors[project.status]} label={PipelineStatusLabels[project.status]} />
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-2 text-center">
                        <div className="bg-white rounded-lg p-2 border border-gray-100">
                          <div className="text-xs font-bold" style={{ color: AssignmentRoleColors[a.assignmentRole] }}>
                            {AssignmentRoleLabels[a.assignmentRole]}
                          </div>
                          <div className="text-[10px] text-gray-400">Szerepem</div>
                        </div>
                        <div className="bg-white rounded-lg p-2 border border-gray-100">
                          <div className="text-xs font-bold text-gray-900">{a.allocatedHoursPerWeek}h/hét</div>
                          <div className="text-[10px] text-gray-400">{a.allocationPercent}% allokáció</div>
                        </div>
                        <div className={`rounded-lg p-2 border ${daysLeft < 60 ? "bg-red-50 border-red-100" : "bg-white border-gray-100"}`}>
                          <div className={`text-xs font-bold ${daysLeft < 60 ? "text-red-600" : "text-gray-900"}`}>{daysLeft} nap</div>
                          <div className="text-[10px] text-gray-400">Hátralévő</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>{formatDate(a.startDate)}</span>
                        <span>PM: {pm?.name ?? "—"}</span>
                        <span>{formatDate(a.endDate)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#C8A951] rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All assignments (including future) */}
            {myAssignments.length > activeAssignments.length && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Egyéb projektek ({myAssignments.length - activeAssignments.length})
                </h3>
                <div className="space-y-2">
                  {myAssignments
                    .filter((a) => !activeAssignments.includes(a))
                    .map((a) => {
                      const project = projects.find((p) => p.id === a.projectId);
                      if (!project) return null;
                      return (
                        <div key={a.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <StatusBadge color={PipelineStatusColors[project.status]} label={PipelineStatusLabels[project.status]} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">{project.company} — {project.projectName}</div>
                            <div className="text-[10px] text-gray-400">
                              {AssignmentRoleLabels[a.assignmentRole]} · {a.allocatedHoursPerWeek}h/hét · {formatDate(a.startDate)} - {formatDate(a.endDate)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Evaluations */}
            {myEvals.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Értékeléseim ({myEvals.length})</h3>
                <div className="space-y-3">
                  {myEvals.map((ev) => {
                    const project = projects.find((p) => p.id === ev.projectId);
                    const evaluator = persons.find((p) => p.id === ev.evaluatorId);
                    return (
                      <div key={ev.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs font-medium text-gray-900">{project?.company} — {project?.projectName}</div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} size={12} className={star <= ev.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                            ))}
                          </div>
                        </div>
                        <div className="text-[10px] text-gray-400 mb-1">{ev.period} · Értékelő: {evaluator?.name} · {formatDate(ev.createdAt)}</div>
                        <div className="text-xs text-gray-600">
                          <span className="text-emerald-700 font-medium">+</span> {ev.strengths}
                        </div>
                        {ev.improvements && (
                          <div className="text-xs text-gray-600 mt-0.5">
                            <span className="text-amber-700 font-medium">*</span> {ev.improvements}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
