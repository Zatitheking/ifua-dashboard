import { useState, useMemo } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { PersonRole, PersonRoleLabels, CompetencyCenter, CompetencyCenterLabels } from "../../types/person";
import { PersonCard } from "./PersonCard";
import { getUtilizationForMonth } from "../../utils/capacity";
import { Button } from "../ui/Button";

interface PeopleDirectoryProps {
  onPersonClick: (id: string) => void;
  onAddPerson: () => void;
}

export function PeopleDirectory({ onPersonClick, onAddPerson }: PeopleDirectoryProps) {
  const { persons, assignments } = useAppStore();
  const now = new Date();

  const [searchQuery, setSearchQuery] = useState("");
  const [ccFilter, setCcFilter] = useState<CompetencyCenter | "all">("all");
  const [roleFilter, setRoleFilter] = useState<PersonRole | "all">("all");
  const [externalFilter, setExternalFilter] = useState<"all" | "internal" | "external">("all");
  const [freeCapacityOnly, setFreeCapacityOnly] = useState(false);

  const personsWithStats = useMemo(() => {
    return persons
      .filter((p) => p.isActive)
      .map((p) => {
        const util = getUtilizationForMonth(p.id, now, assignments, persons);
        return {
          person: p,
          utilization: util.utilizationPercent,
          allocatedHours: util.totalAllocatedHours,
          activeProjects: util.assignments.length,
        };
      });
  }, [persons, assignments]);

  const filtered = useMemo(() => {
    return personsWithStats.filter((item) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!item.person.name.toLowerCase().includes(q) && !item.person.skills.some((s) => s.toLowerCase().includes(q))) return false;
      }
      if (ccFilter !== "all" && item.person.competencyCenter !== ccFilter) return false;
      if (roleFilter !== "all" && item.person.role !== roleFilter) return false;
      if (externalFilter === "internal" && item.person.isExternal) return false;
      if (externalFilter === "external" && !item.person.isExternal) return false;
      if (freeCapacityOnly && item.utilization >= 80) return false;
      return true;
    });
  }, [personsWithStats, searchQuery, ccFilter, roleFilter, externalFilter, freeCapacityOnly]);

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Név vagy skill keresése..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951] w-64"
          />
        </div>
        <select
          value={ccFilter}
          onChange={(e) => setCcFilter(e.target.value as CompetencyCenter | "all")}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]"
        >
          <option value="all">Minden CC</option>
          {Object.values(CompetencyCenter).map((cc) => (
            <option key={cc} value={cc}>{CompetencyCenterLabels[cc]}</option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as PersonRole | "all")}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]"
        >
          <option value="all">Minden szerepkör</option>
          {Object.values(PersonRole).map((r) => (
            <option key={r} value={r}>{PersonRoleLabels[r]}</option>
          ))}
        </select>
        <select
          value={externalFilter}
          onChange={(e) => setExternalFilter(e.target.value as "all" | "internal" | "external")}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]"
        >
          <option value="all">Mindenki</option>
          <option value="internal">Belső</option>
          <option value="external">Külső</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 cursor-pointer">
          <input type="checkbox" checked={freeCapacityOnly} onChange={(e) => setFreeCapacityOnly(e.target.checked)} className="rounded" />
          Szabad kapacitás
        </label>
        <div className="flex-1" />
        <Button onClick={onAddPerson}>
          <Plus size={16} /> Új személy
        </Button>
      </div>

      {/* Stats summary */}
      <div className="text-xs text-gray-500 mb-4">
        {filtered.length} személy · Átl. kihasználtság: {
          filtered.length > 0 ? Math.round(filtered.reduce((s, f) => s + f.utilization, 0) / filtered.length) : 0
        }%
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((item) => (
          <PersonCard
            key={item.person.id}
            person={item.person}
            utilization={item.utilization}
            activeProjects={item.activeProjects}
            allocatedHours={item.allocatedHours}
            onClick={() => onPersonClick(item.person.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">Nincs találat a szűrőknek megfelelően</div>
      )}
    </div>
  );
}
