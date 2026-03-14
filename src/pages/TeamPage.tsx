import { useState } from "react";
import { TopBar } from "../components/layout/TopBar";
import { PeopleDirectory } from "../components/people/PeopleDirectory";
import { PersonDrawer } from "../components/people/PersonDrawer/PersonDrawer";
import { useAppStore } from "../store/appStore";
import { PersonRole, CompetencyCenter } from "../types/person";

export function TeamPage() {
  const { persons, addPerson } = useAppStore();
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  const handleAddPerson = () => {
    const id = `p_${Date.now()}`;
    addPerson({
      id,
      name: "Új munkatárs",
      email: "",
      role: PersonRole.CONSULTANT,
      title: "Tanácsadó",
      competencyCenter: CompetencyCenter.STRATEGY,
      isExternal: false,
      availableHoursPerWeek: 40,
      skills: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setSelectedPersonId(id);
  };

  return (
    <>
      <TopBar title="Csapat" subtitle={`${persons.filter((p) => p.isActive).length} aktív munkatárs`} />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PeopleDirectory onPersonClick={setSelectedPersonId} onAddPerson={handleAddPerson} />
      </div>
      <PersonDrawer personId={selectedPersonId} open={selectedPersonId !== null} onClose={() => setSelectedPersonId(null)} />
    </>
  );
}
