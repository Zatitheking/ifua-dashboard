import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project } from "../types/project";
import type { Person } from "../types/person";
import type { ProjectAssignment } from "../types/assignment";
import type { ProjectDocument, OneDriveLink, PersonEvaluation } from "../types/document";
import type { Client } from "../types/client";
import { seedProjects } from "../data/seed.projects";
import { seedPersons } from "../data/seed.persons";
import { seedAssignments } from "../data/seed.assignments";
import { seedDocuments, seedOneDriveLinks, seedEvaluations } from "../data/seed.documents";
import { seedClients } from "../data/seed.clients";

interface AppState {
  projects: Project[];
  persons: Person[];
  assignments: ProjectAssignment[];
  documents: ProjectDocument[];
  oneDriveLinks: OneDriveLink[];
  evaluations: PersonEvaluation[];
  clients: Client[];

  selectedProjectId: string | null;
  selectedPersonId: string | null;
  sidebarCollapsed: boolean;

  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  setPersons: (persons: Person[]) => void;
  addPerson: (person: Person) => void;
  updatePerson: (id: string, data: Partial<Person>) => void;

  addAssignment: (assignment: ProjectAssignment) => void;
  updateAssignment: (id: string, data: Partial<ProjectAssignment>) => void;
  deleteAssignment: (id: string) => void;

  addDocument: (doc: ProjectDocument) => void;
  deleteDocument: (id: string) => void;
  addOneDriveLink: (link: OneDriveLink) => void;
  deleteOneDriveLink: (id: string) => void;
  addEvaluation: (evaluation: PersonEvaluation) => void;
  deleteEvaluation: (id: string) => void;

  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  setSelectedProjectId: (id: string | null) => void;
  setSelectedPersonId: (id: string | null) => void;
  toggleSidebar: () => void;

  resetToSeed: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      projects: seedProjects,
      persons: seedPersons,
      assignments: seedAssignments,
      documents: seedDocuments,
      oneDriveLinks: seedOneDriveLinks,
      evaluations: seedEvaluations,
      clients: seedClients,

      selectedProjectId: null,
      selectedPersonId: null,
      sidebarCollapsed: false,

      setProjects: (projects) => set({ projects }),
      addProject: (project) => set((s) => ({ projects: [...s.projects, project] })),
      updateProject: (id, data) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p)),
        })),
      deleteProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          assignments: s.assignments.filter((a) => a.projectId !== id),
        })),

      setPersons: (persons) => set({ persons }),
      addPerson: (person) => set((s) => ({ persons: [...s.persons, person] })),
      updatePerson: (id, data) =>
        set((s) => ({
          persons: s.persons.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p)),
        })),

      addAssignment: (assignment) => set((s) => ({ assignments: [...s.assignments, assignment] })),
      updateAssignment: (id, data) =>
        set((s) => ({
          assignments: s.assignments.map((a) => (a.id === id ? { ...a, ...data } : a)),
        })),
      deleteAssignment: (id) => set((s) => ({ assignments: s.assignments.filter((a) => a.id !== id) })),

      addDocument: (doc) => set((s) => ({ documents: [...s.documents, doc] })),
      deleteDocument: (id) => set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),
      addOneDriveLink: (link) => set((s) => ({ oneDriveLinks: [...s.oneDriveLinks, link] })),
      deleteOneDriveLink: (id) => set((s) => ({ oneDriveLinks: s.oneDriveLinks.filter((l) => l.id !== id) })),
      addEvaluation: (evaluation) => set((s) => ({ evaluations: [...s.evaluations, evaluation] })),
      deleteEvaluation: (id) => set((s) => ({ evaluations: s.evaluations.filter((e) => e.id !== id) })),

      addClient: (client) => set((s) => ({ clients: [...s.clients, client] })),
      updateClient: (id, data) =>
        set((s) => ({
          clients: s.clients.map((c) => (c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c)),
        })),
      deleteClient: (id) => set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),

      setSelectedProjectId: (id) => set({ selectedProjectId: id }),
      setSelectedPersonId: (id) => set({ selectedPersonId: id }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      resetToSeed: () =>
        set({
          projects: seedProjects,
          persons: seedPersons,
          assignments: seedAssignments,
          documents: seedDocuments,
          oneDriveLinks: seedOneDriveLinks,
          evaluations: seedEvaluations,
          clients: seedClients,
          selectedProjectId: null,
          selectedPersonId: null,
        }),
    }),
    {
      name: "ifua-pipeline-store",
      version: 4,
    }
  )
);
