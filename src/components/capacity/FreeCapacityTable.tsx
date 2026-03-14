import { useAppStore } from "../../store/appStore";
import { CompetencyCenterLabels, PersonRoleLabels } from "../../types/person";
import { getFreeCapacity } from "../../utils/capacity";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { ProgressBar } from "../ui/ProgressBar";

interface FreeCapacityTableProps {
  onPersonClick: (id: string) => void;
}

export function FreeCapacityTable({ onPersonClick }: FreeCapacityTableProps) {
  const { persons, assignments } = useAppStore();
  const now = new Date();

  const capacity = getFreeCapacity(persons, assignments, now)
    .filter((c) => c.person.availableHoursPerWeek > 0);

  const free = capacity.filter((c) => c.utilizationPercent < 80);
  const busy = capacity.filter((c) => c.utilizationPercent >= 80 && c.utilizationPercent <= 100);
  const over = capacity.filter((c) => c.isOverallocated);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Szabad kapacitás</h3>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 bg-green-50 rounded-lg text-center border border-green-100">
          <div className="text-2xl font-bold text-green-700">{free.length}</div>
          <div className="text-xs text-green-600">Elérhető (&lt;80%)</div>
        </div>
        <div className="p-3 bg-amber-50 rounded-lg text-center border border-amber-100">
          <div className="text-2xl font-bold text-amber-700">{busy.length}</div>
          <div className="text-xs text-amber-600">Foglalt (80–100%)</div>
        </div>
        <div className="p-3 bg-red-50 rounded-lg text-center border border-red-100">
          <div className="text-2xl font-bold text-red-700">{over.length}</div>
          <div className="text-xs text-red-600">Túlterhelt (&gt;100%)</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-medium text-gray-500 pb-2">Személy</th>
              <th className="text-left text-xs font-medium text-gray-500 pb-2">CC</th>
              <th className="text-left text-xs font-medium text-gray-500 pb-2">Kihasználtság</th>
              <th className="text-right text-xs font-medium text-gray-500 pb-2">Szabad (h/hét)</th>
              <th className="text-right text-xs font-medium text-gray-500 pb-2">Projektek</th>
              <th className="text-left text-xs font-medium text-gray-500 pb-2">Skillek</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {capacity.map((c) => (
              <tr
                key={c.person.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onPersonClick(c.person.id)}
              >
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <Avatar name={c.person.name} size="sm" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{c.person.name}</div>
                      <div className="text-[10px] text-gray-400">{PersonRoleLabels[c.person.role]}</div>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 text-xs text-gray-500">
                  {c.person.competencyCenter ? CompetencyCenterLabels[c.person.competencyCenter] : "Külső"}
                </td>
                <td className="py-2.5 w-32">
                  <ProgressBar value={c.utilizationPercent} size="sm" />
                </td>
                <td className={`py-2.5 text-right text-sm font-semibold tabular-nums ${c.freeHoursPerWeek > 0 ? "text-green-600" : "text-red-500"}`}>
                  {Math.round(c.freeHoursPerWeek)}h
                </td>
                <td className="py-2.5 text-right text-xs text-gray-500">{c.activeProjectCount}</td>
                <td className="py-2.5">
                  <div className="flex gap-1 flex-wrap">
                    {c.person.skills.slice(0, 2).map((s) => (
                      <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
