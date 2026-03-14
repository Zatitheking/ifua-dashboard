import { useState } from "react";
import { TopBar } from "../components/layout/TopBar";
import { UtilizationHeatmap } from "../components/capacity/UtilizationHeatmap";
import { FreeCapacityTable } from "../components/capacity/FreeCapacityTable";
import { PersonDrawer } from "../components/people/PersonDrawer/PersonDrawer";

export function CapacityPage() {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  return (
    <>
      <TopBar title="Kapacitás" subtitle="Csapat terheltség és szabad kapacitás" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <UtilizationHeatmap onPersonClick={setSelectedPersonId} />
        <FreeCapacityTable onPersonClick={setSelectedPersonId} />
      </div>
      <PersonDrawer personId={selectedPersonId} open={selectedPersonId !== null} onClose={() => setSelectedPersonId(null)} />
    </>
  );
}
