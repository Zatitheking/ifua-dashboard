import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project } from "../types/project";
import type { Person } from "../types/person";
import type { ProjectAssignment } from "../types/assignment";
import { seedProjects } from "../data/seed.projects";
import { seedPersons } from "../data/seed.persons";
import { seedAssignments } from "../data/seed.assignments";

interface AppState {
  projects: Project[];
  persons: Person[];
  assignments: ProjectAssignment[];

  // UI state
  selectedProjectId: string | null;
  selectedPersonId: string | null;
  sidebarCollapsed: boolean;

  // Actions
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

      setSelectedProjectId: (id) => set({ selectedProjectId: id }),
      setSelectedPersonId: (id) => set({ selectedPersonId: id }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      resetToSeed: () =>
        set({
          projects: seedProjects,
          persons: seedPersons,
          assignments: seedAssignments,
          selectedProjectId: null,
          selectedPersonId: null,
        }),
    }),
    {
      name: "ifua-pipeline-store",
      version: 2,
    }
  )
);
