import { useState, useRef } from "react";
import { Upload, ExternalLink, FileText, Trash2, Plus, Link2, Presentation } from "lucide-react";
import { useAppStore } from "../../../store/appStore";
import { type Project } from "../../../types/project";
import { DocumentType, DocumentTypeLabels } from "../../../types/document";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { formatDate } from "../../../utils/format";

interface ProjectDocsTabProps {
  project: Project;
}

export function ProjectDocsTab({ project }: ProjectDocsTabProps) {
  const { documents, oneDriveLinks, addDocument, deleteDocument, addOneDriveLink, deleteOneDriveLink } = useAppStore();
  const [showUpload, setShowUpload] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newDoc, setNewDoc] = useState({ name: "", type: DocumentType.PROPOSAL_SLIDE, notes: "" });
  const [newLink, setNewLink] = useState({ label: "", url: "" });

  const projectDocs = documents.filter((d) => d.projectId === project.id);
  const projectLinks = oneDriveLinks.filter((l) => l.projectId === project.id);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      addDocument({
        id: `doc_${Date.now()}`,
        projectId: project.id,
        name: newDoc.name || file.name.replace(/\.[^.]+$/, ""),
        type: newDoc.type,
        fileName: file.name,
        fileSize: file.size,
        fileData: reader.result as string,
        uploadedBy: "Admin",
        uploadedAt: new Date().toISOString().slice(0, 10),
        notes: newDoc.notes || undefined,
      });
      setShowUpload(false);
      setNewDoc({ name: "", type: DocumentType.PROPOSAL_SLIDE, notes: "" });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleAddLink = () => {
    if (!newLink.label || !newLink.url) return;
    addOneDriveLink({
      id: `od_${Date.now()}`,
      projectId: project.id,
      label: newLink.label,
      url: newLink.url,
      addedBy: "Admin",
      addedAt: new Date().toISOString().slice(0, 10),
    });
    setShowAddLink(false);
    setNewLink({ label: "", url: "" });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes > 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    return `${(bytes / 1_000).toFixed(0)} KB`;
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]";

  return (
    <div className="space-y-6">
      {/* Documents section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dokumentumok</h4>
          <Button variant="secondary" size="sm" onClick={() => setShowUpload(true)}>
            <Upload size={14} /> Feltöltés
          </Button>
        </div>

        {projectDocs.length === 0 && !showUpload && (
          <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
            Nincs feltöltött dokumentum
          </div>
        )}

        <div className="space-y-2">
          {projectDocs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 group">
              <div className="p-2 bg-white rounded-lg border border-gray-200 shrink-0">
                {doc.type === DocumentType.PROPOSAL_SLIDE ? (
                  <Presentation size={18} className="text-amber-600" />
                ) : (
                  <FileText size={18} className="text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{doc.name}</div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5 flex-wrap">
                  <Badge className="text-[10px]">{DocumentTypeLabels[doc.type]}</Badge>
                  {doc.fileName && <span>{doc.fileName}</span>}
                  {doc.fileSize && <span>({formatFileSize(doc.fileSize)})</span>}
                  <span>· {doc.uploadedBy}</span>
                  <span>· {formatDate(doc.uploadedAt)}</span>
                </div>
                {doc.notes && <div className="text-[10px] text-gray-500 mt-1 italic">{doc.notes}</div>}
              </div>
              <button
                onClick={() => deleteDocument(doc.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Upload form */}
        {showUpload && (
          <div className="mt-3 p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Dokumentum feltöltése</h4>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                dragOver ? "border-[#C8A951] bg-[#C8A951]/5" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Húzd ide a fájlt vagy kattints a tallózáshoz</p>
              <p className="text-[10px] text-gray-400 mt-1">PPTX, PDF, DOCX (max 10 MB)</p>
              <input ref={fileInputRef} type="file" className="hidden" accept=".pptx,.pdf,.docx,.xlsx,.ppt,.doc" onChange={(e) => handleFileSelect(e.target.files)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Név</label>
                <input className={inputClass} placeholder="Dokumentum neve..." value={newDoc.name} onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Típus</label>
                <select className={inputClass} value={newDoc.type} onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value as DocumentType })}>
                  {Object.values(DocumentType).map((t) => (
                    <option key={t} value={t}>{DocumentTypeLabels[t]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Megjegyzés</label>
              <input className={inputClass} placeholder="Opcionális megjegyzés..." value={newDoc.notes} onChange={(e) => setNewDoc({ ...newDoc, notes: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>Mégse</Button>
            </div>
          </div>
        )}
      </div>

      {/* OneDrive Links section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">OneDrive / SharePoint</h4>
          <Button variant="secondary" size="sm" onClick={() => setShowAddLink(true)}>
            <Link2 size={14} /> Link hozzáadása
          </Button>
        </div>

        {projectLinks.length === 0 && !showAddLink && (
          <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
            Nincs csatolt OneDrive link
          </div>
        )}

        <div className="space-y-2">
          {projectLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 group">
              <div className="p-2 bg-white rounded-lg border border-blue-200 shrink-0">
                <ExternalLink size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-700 hover:text-blue-900 underline decoration-blue-300 truncate block"
                >
                  {link.label}
                </a>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {link.addedBy} · {formatDate(link.addedAt)}
                </div>
              </div>
              <button
                onClick={() => deleteOneDriveLink(link.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Add link form */}
        {showAddLink && (
          <div className="mt-3 p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">OneDrive link hozzáadása</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Megnevezés</label>
                <input className={inputClass} placeholder="Pl. Projekt mappa..." value={newLink.label} onChange={(e) => setNewLink({ ...newLink, label: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
                <input className={inputClass} placeholder="https://sharepoint.com/..." value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAddLink(false)}>Mégse</Button>
              <Button size="sm" onClick={handleAddLink} disabled={!newLink.label || !newLink.url}>Mentés</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
