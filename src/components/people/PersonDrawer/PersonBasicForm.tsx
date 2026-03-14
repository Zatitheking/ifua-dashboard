import { useState } from "react";
import { useAppStore } from "../../../store/appStore";
import { type Person, PersonRole, PersonRoleLabels, CompetencyCenter, CompetencyCenterLabels } from "../../../types/person";
import { Button } from "../../ui/Button";
import { Avatar } from "../../ui/Avatar";

interface PersonBasicFormProps {
  person: Person;
}

export function PersonBasicForm({ person }: PersonBasicFormProps) {
  const { updatePerson } = useAppStore();
  const [form, setForm] = useState({ ...person, skills: [...person.skills] });
  const [skillInput, setSkillInput] = useState("");

  const handleChange = (field: keyof Person, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updatePerson(person.id, form);
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <Avatar name={form.name} size="lg" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{form.name}</h3>
          <p className="text-sm text-gray-500">{form.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className={labelClass}>Név</label>
          <input className={inputClass} value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Beosztás</label>
          <input className={inputClass} value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" className={inputClass} value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Telefon</label>
          <input className={inputClass} value={form.phone ?? ""} onChange={(e) => handleChange("phone", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className={labelClass}>Szerepkör</label>
          <select className={inputClass} value={form.role} onChange={(e) => handleChange("role", e.target.value)}>
            {Object.values(PersonRole).map((r) => (
              <option key={r} value={r}>{PersonRoleLabels[r]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Kompetenciaközpont</label>
          <select className={inputClass} value={form.competencyCenter ?? ""} onChange={(e) => handleChange("competencyCenter", e.target.value || null)}>
            <option value="">— Nincs (külső) —</option>
            {Object.values(CompetencyCenter).map((cc) => (
              <option key={cc} value={cc}>{CompetencyCenterLabels[cc]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Heti kapacitás (óra)</label>
          <input type="number" className={inputClass} value={form.availableHoursPerWeek} min={0} max={60} onChange={(e) => handleChange("availableHoursPerWeek", Number(e.target.value))} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isExternal} onChange={(e) => handleChange("isExternal", e.target.checked)} className="rounded" />
          Külső munkatárs
        </label>
        {form.isExternal && (
          <div className="flex-1">
            <input className={inputClass} placeholder="Szervezet" value={form.externalOrg ?? ""} onChange={(e) => handleChange("externalOrg", e.target.value)} />
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Szaktudás</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.skills.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {skill}
              <button onClick={() => removeSkill(skill)} className="text-gray-400 hover:text-red-500 cursor-pointer">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Új skill hozzáadása..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
          />
          <Button variant="secondary" size="sm" onClick={addSkill}>+</Button>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave}>Mentés</Button>
      </div>
    </div>
  );
}
