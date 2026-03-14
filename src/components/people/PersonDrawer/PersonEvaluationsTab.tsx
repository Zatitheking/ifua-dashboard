import { useState } from "react";
import { Star, Plus, Trash2 } from "lucide-react";
import { useAppStore } from "../../../store/appStore";
import { type Person } from "../../../types/person";
import { Button } from "../../ui/Button";
import { formatDate } from "../../../utils/format";

interface PersonEvaluationsTabProps {
  person: Person;
}

export function PersonEvaluationsTab({ person }: PersonEvaluationsTabProps) {
  const { evaluations, projects, persons, addEvaluation, deleteEvaluation } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  const personEvals = evaluations.filter((e) => e.personId === person.id);

  const [form, setForm] = useState({
    projectId: "",
    evaluatorId: "",
    rating: 4,
    strengths: "",
    improvements: "",
    comments: "",
    period: "2026 Q1",
  });

  const handleSubmit = () => {
    if (!form.projectId || !form.evaluatorId || !form.strengths) return;
    addEvaluation({
      id: `ev_${Date.now()}`,
      personId: person.id,
      projectId: form.projectId,
      evaluatorId: form.evaluatorId,
      rating: form.rating,
      strengths: form.strengths,
      improvements: form.improvements,
      comments: form.comments,
      period: form.period,
      createdAt: new Date().toISOString().slice(0, 10),
    });
    setShowForm(false);
    setForm({ projectId: "", evaluatorId: "", rating: 4, strengths: "", improvements: "", comments: "", period: "2026 Q1" });
  };

  const renderStars = (rating: number, interactive = false, onChange?: (v: number) => void) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={interactive ? 20 : 14}
          className={`${star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => interactive && onChange?.(star)}
        />
      ))}
    </div>
  );

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Projektértékelések</h4>
        <Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>
          <Plus size={14} /> Új értékelés
        </Button>
      </div>

      {personEvals.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
          Nincs értékelés ehhez a személyhez
        </div>
      )}

      <div className="space-y-3">
        {personEvals.map((ev) => {
          const project = projects.find((p) => p.id === ev.projectId);
          const evaluator = persons.find((p) => p.id === ev.evaluatorId);
          return (
            <div key={ev.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 group">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{project?.projectName ?? "—"}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {project?.company} · {ev.period} · Értékelő: {evaluator?.name ?? "—"} · {formatDate(ev.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(ev.rating)}
                  <button
                    onClick={() => deleteEvaluation(ev.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium text-emerald-700">Erősségek: </span>
                  <span className="text-gray-600">{ev.strengths}</span>
                </div>
                <div>
                  <span className="font-medium text-amber-700">Fejlesztendő: </span>
                  <span className="text-gray-600">{ev.improvements}</span>
                </div>
              </div>
              {ev.comments && (
                <div className="text-xs text-gray-500 mt-1.5 italic">{ev.comments}</div>
              )}
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Új értékelés</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Projekt</label>
              <select className={inputClass} value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                <option value="">Válassz projektet...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.company} — {p.projectName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Értékelő</label>
              <select className={inputClass} value={form.evaluatorId} onChange={(e) => setForm({ ...form, evaluatorId: e.target.value })}>
                <option value="">Válassz értékelőt...</option>
                {persons.filter((p) => p.id !== person.id).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Értékelés</label>
              {renderStars(form.rating, true, (v) => setForm({ ...form, rating: v }))}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Időszak</label>
              <input className={inputClass} placeholder="Pl. 2026 Q1" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Erősségek</label>
            <textarea className={inputClass} rows={2} placeholder="Miben volt kiemelkedő..." value={form.strengths} onChange={(e) => setForm({ ...form, strengths: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fejlesztendő területek</label>
            <textarea className={inputClass} rows={2} placeholder="Miben fejlődhet..." value={form.improvements} onChange={(e) => setForm({ ...form, improvements: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Megjegyzés</label>
            <input className={inputClass} placeholder="Szabad szöveges megjegyzés..." value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Mégse</Button>
            <Button size="sm" onClick={handleSubmit} disabled={!form.projectId || !form.evaluatorId || !form.strengths}>Mentés</Button>
          </div>
        </div>
      )}
    </div>
  );
}
