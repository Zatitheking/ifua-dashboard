import { useState } from "react";
import { Search, Plus, Building2, Phone, Mail, MapPin, Globe, FileText, X, Trash2 } from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { useAppStore } from "../store/appStore";
import { IndustryLabels, Industry, PipelineStatusLabels, PipelineStatusColors } from "../types/project";
import { formatCurrency, formatCurrencyFull, formatDate, getInitials, getAvatarColor } from "../utils/format";
import { PersonRoleLabels } from "../types/person";
import { Button } from "../components/ui/Button";
import { Badge, StatusBadge } from "../components/ui/Badge";
import type { Client } from "../types/client";

export function ClientsPage() {
  const { clients, projects, assignments, persons, addClient, updateClient, deleteClient } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(clients[0]?.id ?? null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filtered = clients.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.contactName.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q);
  });

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const clientProjects = selectedClient ? projects.filter((p) => p.company === selectedClient.name) : [];
  const totalRevenue = clientProjects.reduce((s, p) => s + p.expectedRevenue, 0);
  const weightedRevenue = clientProjects.reduce((s, p) => s + p.weightedRevenue, 0);
  const activeCount = clientProjects.filter((p) => ["active", "won"].includes(p.status)).length;

  // Get unique team members across all client projects
  const teamPersonIds = new Set<string>();
  clientProjects.forEach((p) => {
    assignments.filter((a) => a.projectId === p.id).forEach((a) => teamPersonIds.add(a.personId));
  });
  const teamMembers = persons.filter((p) => teamPersonIds.has(p.id));

  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: "", industry: Industry.IT, contactName: "", contactEmail: "", contactPhone: "", address: "", notes: "", isActive: true,
  });

  const handleAddClient = () => {
    if (!newClient.name || !newClient.contactName) return;
    const client: Client = {
      id: `cl_${Date.now()}`,
      name: newClient.name!,
      industry: (newClient.industry as Industry) ?? Industry.IT,
      contactName: newClient.contactName!,
      contactEmail: newClient.contactEmail ?? "",
      contactPhone: newClient.contactPhone ?? "",
      address: newClient.address ?? "",
      website: newClient.website,
      taxNumber: newClient.taxNumber,
      notes: newClient.notes ?? "",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addClient(client);
    setSelectedClientId(client.id);
    setShowNewForm(false);
    setNewClient({ name: "", industry: Industry.IT, contactName: "", contactEmail: "", contactPhone: "", address: "", notes: "", isActive: true });
  };

  const handleSaveEdit = () => {
    if (!editingClient) return;
    updateClient(editingClient.id, editingClient);
    setEditingClient(null);
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]";

  return (
    <>
      <TopBar title="Ügyfelek" subtitle={`${clients.length} cég a rendszerben`} />
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel — client list */}
        <div className="w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-100 space-y-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Keresés..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951]"
              />
            </div>
            <Button size="sm" className="w-full" onClick={() => setShowNewForm(true)}>
              <Plus size={14} /> Új ügyfél
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((client) => {
              const projCount = projects.filter((p) => p.company === client.name).length;
              const rev = projects.filter((p) => p.company === client.name).reduce((s, p) => s + p.expectedRevenue, 0);
              return (
                <div
                  key={client.id}
                  onClick={() => { setSelectedClientId(client.id); setEditingClient(null); }}
                  className={`p-3 border-b border-gray-50 cursor-pointer transition-colors ${
                    selectedClientId === client.id ? "bg-amber-50 border-l-2 border-l-[#C8A951]" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Building2 size={14} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{client.name}</div>
                      <div className="text-[10px] text-gray-400">
                        {IndustryLabels[client.industry]} · {projCount} projekt · {formatCurrency(rev)}
                      </div>
                    </div>
                    {!client.isActive && <Badge className="text-[9px] bg-red-50 text-red-600 border-red-200">Inaktív</Badge>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel — detail */}
        <div className="flex-1 overflow-y-auto bg-[#F4F5F7] p-4 sm:p-6">
          {showNewForm ? (
            <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Új ügyfél felvétele</h3>
                <button onClick={() => setShowNewForm(false)} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Cégnév *</label>
                  <input className={inputClass} placeholder="Pl. Demo Kft." value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Iparág</label>
                  <select className={inputClass} value={newClient.industry} onChange={(e) => setNewClient({ ...newClient, industry: e.target.value as Industry })}>
                    {Object.values(Industry).map((i) => <option key={i} value={i}>{IndustryLabels[i]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Kapcsolattartó neve *</label>
                  <input className={inputClass} placeholder="Név" value={newClient.contactName} onChange={(e) => setNewClient({ ...newClient, contactName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input className={inputClass} type="email" placeholder="email@ceg.hu" value={newClient.contactEmail} onChange={(e) => setNewClient({ ...newClient, contactEmail: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Telefon</label>
                  <input className={inputClass} placeholder="+36 ..." value={newClient.contactPhone} onChange={(e) => setNewClient({ ...newClient, contactPhone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Weboldal</label>
                  <input className={inputClass} placeholder="https://..." value={newClient.website ?? ""} onChange={(e) => setNewClient({ ...newClient, website: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Cím</label>
                  <input className={inputClass} placeholder="1234 Budapest, ..." value={newClient.address} onChange={(e) => setNewClient({ ...newClient, address: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Adószám</label>
                  <input className={inputClass} placeholder="12345678-1-23" value={newClient.taxNumber ?? ""} onChange={(e) => setNewClient({ ...newClient, taxNumber: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Megjegyzés</label>
                  <input className={inputClass} placeholder="Opcionális..." value={newClient.notes} onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowNewForm(false)}>Mégse</Button>
                <Button onClick={handleAddClient} disabled={!newClient.name || !newClient.contactName}>Mentés</Button>
              </div>
            </div>
          ) : selectedClient ? (
            <div className="space-y-5">
              {/* Header */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#1A1F2E] flex items-center justify-center text-white text-lg font-bold">
                      {getInitials(selectedClient.name)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedClient.name}</h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge>{IndustryLabels[selectedClient.industry]}</Badge>
                        {selectedClient.isActive
                          ? <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Aktív</Badge>
                          : <Badge className="bg-red-50 text-red-600 border-red-200">Inaktív</Badge>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setEditingClient({ ...selectedClient })}>Szerkesztés</Button>
                    <Button variant="danger" size="sm" onClick={() => { deleteClient(selectedClient.id); setSelectedClientId(filtered[0]?.id ?? null); }}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{selectedClient.contactEmail || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    <span>{selectedClient.contactPhone || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{selectedClient.address || "—"}</span>
                  </div>
                  {selectedClient.website && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Globe size={14} className="shrink-0" />
                      <span className="truncate">{selectedClient.website}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Kapcsolattartó:</span> {selectedClient.contactName}
                  {selectedClient.taxNumber && <span className="ml-4 text-gray-400">Adószám: {selectedClient.taxNumber}</span>}
                </div>
                {selectedClient.notes && (
                  <div className="mt-2 text-xs text-gray-500 italic">{selectedClient.notes}</div>
                )}
              </div>

              {/* Edit form */}
              {editingClient && (
                <div className="bg-white rounded-xl border border-amber-200 p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">Ügyfél szerkesztése</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Cégnév</label>
                      <input className={inputClass} value={editingClient.name} onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Iparág</label>
                      <select className={inputClass} value={editingClient.industry} onChange={(e) => setEditingClient({ ...editingClient, industry: e.target.value as Industry })}>
                        {Object.values(Industry).map((i) => <option key={i} value={i}>{IndustryLabels[i]}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Kapcsolattartó</label>
                      <input className={inputClass} value={editingClient.contactName} onChange={(e) => setEditingClient({ ...editingClient, contactName: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                      <input className={inputClass} value={editingClient.contactEmail} onChange={(e) => setEditingClient({ ...editingClient, contactEmail: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Telefon</label>
                      <input className={inputClass} value={editingClient.contactPhone} onChange={(e) => setEditingClient({ ...editingClient, contactPhone: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Cím</label>
                      <input className={inputClass} value={editingClient.address} onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingClient(null)}>Mégse</Button>
                    <Button size="sm" onClick={handleSaveEdit}>Mentés</Button>
                  </div>
                </div>
              )}

              {/* KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase">Projektek</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{clientProjects.length}</div>
                  <div className="text-[10px] text-gray-400">{activeCount} aktív</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase">Összbevétel</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalRevenue)}</div>
                  <div className="text-[10px] text-gray-400">elvárt</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase">Súlyozott</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(weightedRevenue)}</div>
                  <div className="text-[10px] text-gray-400">pipeline</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase">Csapat</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{teamMembers.length}</div>
                  <div className="text-[10px] text-gray-400">érintett személy</div>
                </div>
              </div>

              {/* Projects */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Projektek ({clientProjects.length})</h3>
                {clientProjects.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-sm">Nincs projekt ehhez az ügyfélhez</div>
                ) : (
                  <div className="space-y-2">
                    {clientProjects.map((p) => {
                      const pm = persons.find((pe) => pe.id === p.projectManagerId);
                      const sponsor = persons.find((pe) => pe.id === p.sponsorId);
                      const teamCount = assignments.filter((a) => a.projectId === p.id).length;
                      return (
                        <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <StatusBadge color={PipelineStatusColors[p.status]} label={PipelineStatusLabels[p.status]} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">{p.projectName}</div>
                            <div className="text-[10px] text-gray-400">
                              PM: {pm?.name ?? "—"} · Szponzor: {sponsor?.name ?? "—"} · {teamCount} fő · {formatDate(p.startDate)} - {formatDate(p.endDate)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">{formatCurrency(p.expectedRevenue)}</div>
                            <div className="text-[10px] text-gray-400">{p.probability}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Team members who worked on this client's projects */}
              {teamMembers.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Érintett tanácsadók ({teamMembers.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {teamMembers.map((m) => {
                      const memberProjects = clientProjects.filter((p) =>
                        assignments.some((a) => a.projectId === p.id && a.personId === m.id)
                      );
                      const totalHours = assignments
                        .filter((a) => a.personId === m.id && clientProjects.some((p) => p.id === a.projectId))
                        .reduce((s, a) => s + a.allocatedHoursPerWeek, 0);
                      return (
                        <div key={m.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ backgroundColor: getAvatarColor(m.name) }}
                          >
                            {getInitials(m.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-medium text-gray-900 truncate">{m.name}</div>
                            <div className="text-[10px] text-gray-400">{PersonRoleLabels[m.role]} · {totalHours}h/hét · {memberProjects.length} projekt</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Válassz ki egy ügyfelet a bal oldali listából
            </div>
          )}
        </div>
      </div>
    </>
  );
}
