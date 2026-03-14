import { useState } from "react";
import { useAppStore } from "../../../store/appStore";
import {
  type Project,
  PipelineStatus,
  PipelineStatusLabels,
  PipelineStatusDefaults,
  Industry,
  IndustryLabels,
  ProjectType,
  ProjectTypeLabels,
} from "../../../types/project";
import { Button } from "../../ui/Button";
import { formatCurrencyFull } from "../../../utils/format";

interface ProjectBasicFormProps {
  project: Project;
}

export function ProjectBasicForm({ project }: ProjectBasicFormProps) {
  const { updateProject } = useAppStore();
  const [form, setForm] = useState({ ...project });

  const handleChange = (field: keyof Project, value: string | number) => {
    const updated = { ...form, [field]: value };

    if (field === "status") {
      const status = value as PipelineStatus;
      updated.probability = PipelineStatusDefaults[status];
      updated.weightedRevenue = updated.expectedRevenue * (updated.probability / 100);
    }
    if (field === "expectedRevenue" || field === "probability") {
      updated.weightedRevenue = Number(updated.expectedRevenue) * (Number(updated.probability) / 100);
    }

    setForm(updated);
  };

  const handleSave = () => {
    updateProject(project.id, form);
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className={labelClass}>Ügyfél</label>
          <input className={inputClass} value={form.company} onChange={(e) => handleChange("company", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Projekt név</label>
          <input className={inputClass} value={form.projectName} onChange={(e) => handleChange("projectName", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className={labelClass}>Iparág</label>
          <select className={inputClass} value={form.industry} onChange={(e) => handleChange("industry", e.target.value)}>
            {Object.values(Industry).map((i) => (
              <option key={i} value={i}>{IndustryLabels[i]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Projekt típus</label>
          <select className={inputClass} value={form.projectType} onChange={(e) => handleChange("projectType", e.target.value)}>
            {Object.values(ProjectType).map((t) => (
              <option key={t} value={t}>{ProjectTypeLabels[t]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Státusz</label>
          <select className={inputClass} value={form.status} onChange={(e) => handleChange("status", e.target.value)}>
            {Object.values(PipelineStatus).map((s) => (
              <option key={s} value={s}>{PipelineStatusLabels[s]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className={labelClass}>Várható bevétel (Ft)</label>
          <input
            type="number"
            className={inputClass}
            value={form.expectedRevenue}
            onChange={(e) => handleChange("expectedRevenue", Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Valószínűség (%)</label>
          <input
            type="number"
            className={inputClass}
            value={form.probability}
            min={0}
            max={100}
            onChange={(e) => handleChange("probability", Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Súlyozott bevétel</label>
          <div className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-emerald-700 font-semibold">
            {formatCurrencyFull(Math.round(form.weightedRevenue))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className={labelClass}>Kezdés</label>
          <input type="date" className={inputClass} value={form.startDate} onChange={(e) => handleChange("startDate", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Befejezés</label>
          <input type="date" className={inputClass} value={form.endDate} onChange={(e) => handleChange("endDate", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Megjegyzések</label>
        <textarea className={`${inputClass} min-h-[80px]`} value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} />
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave}>Mentés</Button>
      </div>
    </div>
  );
}
