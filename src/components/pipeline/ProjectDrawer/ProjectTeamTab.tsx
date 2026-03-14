import { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { useAppStore } from "../../../store/appStore";
import { type Project } from "../../../types/project";
import { AssignmentRole, AssignmentRoleLabels, type ProjectAssignment } from "../../../types/assignment";
import { PersonRoleLabels, CompetencyCenterLabels } from "../../../types/person";
import { Avatar } from "../../ui/Avatar";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { ProgressBar } from "../../ui/ProgressBar";

interface ProjectTeamTabProps {
  project: Project;
}

export function ProjectTeamTab({ project }: ProjectTeamTabProps) {
  const { persons, assignments, addAssignment, deleteAssignment, updateProject } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    personId: "",
    assignmentRole: AssignmentRole.CONTRIBUTOR,
    allocatedHoursPerWeek: 20,
    startDate: project.startDate,
    endDate: project.endDate,
    notes: "",
  });

  const projectAssignments = assignments.filter((a) => a.projectId === project.id);
  const sponsor = project.sponsorId ? persons.find((p) => p.id === project.sponsorId) : null;
  const pm = project.projectManagerId ? persons.find((p) => p.id === project.projectManagerId) : null;

  const totalHours = projectAssignments.reduce((s, a) => s + a.allocatedHoursPerWeek, 0);

  const handleAddAssignment = () => {
    if (!newAssignment.personId) return;
    const person = persons.find((p) => p.id === newAssignment.personId);
    if (!person) return;

    const allocationPercent = person.availableHoursPerWeek > 0
      ? (newAssignment.allocatedHoursPerWeek / person.availableHoursPerWeek) * 100
      : 0;

    addAssignment({
      id: `a_${Date.now()}`,
      projectId: project.id,
      personId: newAssignment.personId,
      assignmentRole: newAssignment.assignmentRole,
      allocatedHoursPerWeek: newAssignment.allocatedHoursPerWeek,
      allocationPercent,
      startDate: newAssignment.startDate,
      endDate: newAssignment.endDate,
      notes: newAssignment.notes || undefined,
      createdAt: new Date().toISOString(),
    });

    setShowAdd(false);
    setNewAssignment({
      personId: "",
      assignmentRole: AssignmentRole.CONTRIBUTOR,
      allocatedHoursPerWeek: 20,
      startDate: project.startDate,
      endDate: project.endDate,
      notes: "",
    });
  };

  const handleSetSponsor = (personId: string) => {
    updateProject(project.id, { sponsorId: personId });
  };

  const handleSetPM = (personId: string) => {
    updateProject(project.id, { projectManagerId: personId });
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]";

  return (
    <div className="space-y-6">
      {/* Sponsor */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Szponzor</label>
        {sponsor ? (
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <Avatar name={sponsor.name} size="md" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900">{sponsor.name}</div>
              <div className="text-xs text-gray-500">{PersonRoleLabels[sponsor.role]} · {sponsor.competencyCenter ? CompetencyCenterLabels[sponsor.competencyCenter] : "Külső"}</div>
            </div>
            <select
              className="text-xs border border-gray-200 rounded px-2 py-1"
              value={project.sponsorId ?? ""}
              onChange={(e) => handleSetSponsor(e.target.value)}
            >
              <option value="">— Csere —</option>
              {persons.filter((p) => p.isActive).map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <select className={inputClass} onChange={(e) => handleSetSponsor(e.target.value)} value="">
            <option value="">— Szponzor kiválasztása —</option>
            {persons.filter((p) => p.isActive).map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({PersonRoleLabels[p.role]})</option>
            ))}
          </select>
        )}
      </div>

      {/* PM */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Projektmenedzser</label>
        {pm ? (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Avatar name={pm.name} size="md" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900">{pm.name}</div>
              <div className="text-xs text-gray-500">{PersonRoleLabels[pm.role]} · {pm.competencyCenter ? CompetencyCenterLabels[pm.competencyCenter] : "Külső"}</div>
            </div>
            <select
              className="text-xs border border-gray-200 rounded px-2 py-1"
              value={project.projectManagerId ?? ""}
              onChange={(e) => handleSetPM(e.target.value)}
            >
              <option value="">— Csere —</option>
              {persons.filter((p) => p.isActive).map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <select className={inputClass} onChange={(e) => handleSetPM(e.target.value)} value="">
            <option value="">— PM kiválasztása —</option>
            {persons.filter((p) => p.isActive).map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({PersonRoleLabels[p.role]})</option>
            ))}
          </select>
        )}
      </div>

      {/* Team members */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Csapattagok</label>
          <Button variant="secondary" size="sm" onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Hozzáadás
          </Button>
        </div>

        <div className="space-y-2">
          {projectAssignments.map((a) => {
            const person = persons.find((p) => p.id === a.personId);
            if (!person) return null;
            return (
              <div key={a.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <Avatar name={person.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{person.name}</span>
                    {person.isExternal && <Badge className="text-[10px] bg-orange-50 text-orange-700 border-orange-200">EXT</Badge>}
                  </div>
                  <div className="text-xs text-gray-500">
                    {AssignmentRoleLabels[a.assignmentRole]} · {a.allocatedHoursPerWeek}h/hét
                  </div>
                </div>
                <div className="w-24">
                  <ProgressBar value={a.allocationPercent} size="sm" />
                </div>
                <button
                  onClick={() => deleteAssignment(a.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 px-1">
          <Users size={12} />
          <span>
            {projectAssignments.length} fő · {totalHours} h/hét allokálva
            {projectAssignments.filter((a) => persons.find((p) => p.id === a.personId)?.isExternal).length > 0 &&
              ` · ${projectAssignments.filter((a) => persons.find((p) => p.id === a.personId)?.isExternal).length} külső`}
          </span>
        </div>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Közreműködő hozzáadása</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Személy</label>
              <select className={inputClass} value={newAssignment.personId} onChange={(e) => setNewAssignment({ ...newAssignment, personId: e.target.value })}>
                <option value="">— Kiválasztás —</option>
                {persons.filter((p) => p.isActive).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Szerep</label>
              <select className={inputClass} value={newAssignment.assignmentRole} onChange={(e) => setNewAssignment({ ...newAssignment, assignmentRole: e.target.value as AssignmentRole })}>
                {Object.values(AssignmentRole).map((r) => (
                  <option key={r} value={r}>{AssignmentRoleLabels[r]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Allokáció (h/hét)</label>
              <input type="number" className={inputClass} value={newAssignment.allocatedHoursPerWeek} min={0} max={60} onChange={(e) => setNewAssignment({ ...newAssignment, allocatedHoursPerWeek: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Megjegyzés</label>
              <input className={inputClass} value={newAssignment.notes} onChange={(e) => setNewAssignment({ ...newAssignment, notes: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Kezdés</label>
              <input type="date" className={inputClass} value={newAssignment.startDate} onChange={(e) => setNewAssignment({ ...newAssignment, startDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Befejezés</label>
              <input type="date" className={inputClass} value={newAssignment.endDate} onChange={(e) => setNewAssignment({ ...newAssignment, endDate: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>Mégse</Button>
            <Button size="sm" onClick={handleAddAssignment} disabled={!newAssignment.personId}>Mentés</Button>
          </div>
        </div>
      )}
    </div>
  );
}
