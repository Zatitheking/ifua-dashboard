import { startOfMonth, endOfMonth, isWithinInterval, areIntervalsOverlapping, addMonths, format } from "date-fns";
import { hu } from "date-fns/locale";
import type { Person } from "../types/person";
import type { ProjectAssignment } from "../types/assignment";
import type { Project } from "../types/project";

export interface UtilizationRecord {
  personId: string;
  month: Date;
  totalAllocatedHours: number;
  availableHours: number;
  utilizationPercent: number;
  assignments: ProjectAssignment[];
}

export interface FreeCapacityRecord {
  person: Person;
  utilizationPercent: number;
  freeHoursPerWeek: number;
  isOverallocated: boolean;
  activeProjectCount: number;
}

export function getUtilizationForMonth(
  personId: string,
  month: Date,
  assignments: ProjectAssignment[],
  persons: Person[]
): UtilizationRecord {
  const person = persons.find((p) => p.id === personId);
  const available = person?.availableHoursPerWeek ?? 0;
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  const activeAssignments = assignments.filter((a) => {
    if (a.personId !== personId) return false;
    try {
      return areIntervalsOverlapping(
        { start: new Date(a.startDate), end: new Date(a.endDate) },
        { start: monthStart, end: monthEnd }
      );
    } catch {
      return false;
    }
  });

  const totalAllocated = activeAssignments.reduce((sum, a) => sum + a.allocatedHoursPerWeek, 0);
  const utilization = available > 0 ? (totalAllocated / available) * 100 : 0;

  return {
    personId,
    month,
    totalAllocatedHours: totalAllocated,
    availableHours: available,
    utilizationPercent: utilization,
    assignments: activeAssignments,
  };
}

export function getFreeCapacity(
  persons: Person[],
  assignments: ProjectAssignment[],
  referenceDate: Date
): FreeCapacityRecord[] {
  return persons
    .filter((p) => p.isActive)
    .map((p) => {
      const record = getUtilizationForMonth(p.id, referenceDate, assignments, persons);
      return {
        person: p,
        utilizationPercent: record.utilizationPercent,
        freeHoursPerWeek: Math.max(0, p.availableHoursPerWeek * (1 - record.utilizationPercent / 100)),
        isOverallocated: record.utilizationPercent > 100,
        activeProjectCount: record.assignments.length,
      };
    })
    .sort((a, b) => a.utilizationPercent - b.utilizationPercent);
}

export function getHeatmapData(
  persons: Person[],
  assignments: ProjectAssignment[],
  startMonth: Date,
  monthCount: number
): { person: Person; months: { month: Date; label: string; utilization: number }[] }[] {
  const months = Array.from({ length: monthCount }, (_, i) => addMonths(startMonth, i));

  return persons
    .filter((p) => p.isActive && p.availableHoursPerWeek > 0)
    .map((person) => ({
      person,
      months: months.map((m) => ({
        month: m,
        label: format(m, "MMM", { locale: hu }),
        utilization: getUtilizationForMonth(person.id, m, assignments, persons).utilizationPercent,
      })),
    }));
}

export function getCapacityColor(utilization: number): string {
  if (utilization === 0) return "#F3F4F6";
  if (utilization < 60) return "#D1FAE5";
  if (utilization < 80) return "#FEF3C7";
  if (utilization <= 100) return "#FDE68A";
  return "#FCA5A5";
}

export function getCapacityTextColor(utilization: number): string {
  if (utilization === 0) return "#9CA3AF";
  if (utilization < 60) return "#065F46";
  if (utilization < 80) return "#92400E";
  if (utilization <= 100) return "#78350F";
  return "#991B1B";
}

export function getProjectTeamStats(
  projectId: string,
  assignments: ProjectAssignment[],
  persons: Person[]
) {
  const projectAssignments = assignments.filter((a) => a.projectId === projectId);
  const teamMembers = projectAssignments
    .map((a) => ({ assignment: a, person: persons.find((p) => p.id === a.personId) }))
    .filter((m) => m.person);

  return {
    teamSize: teamMembers.length,
    totalAllocatedHours: projectAssignments.reduce((s, a) => s + a.allocatedHoursPerWeek, 0),
    externalCount: teamMembers.filter((m) => m.person!.isExternal).length,
    members: teamMembers,
  };
}
