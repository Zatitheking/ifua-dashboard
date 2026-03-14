import { type ProjectAssignment, AssignmentRole } from "../types/assignment";

export const seedAssignments: ProjectAssignment[] = [
  // PR1 - OTP Bank Digitális Transzformáció (ACTIVE)
  { id: "a1", projectId: "pr1", personId: "p2", assignmentRole: AssignmentRole.SPONSOR, allocatedHoursPerWeek: 4, allocationPercent: 10, startDate: "2026-01-15", endDate: "2026-09-30", createdAt: "2026-01-10" },
  { id: "a2", projectId: "pr1", personId: "p3", assignmentRole: AssignmentRole.PROJECT_MANAGER, allocatedHoursPerWeek: 20, allocationPercent: 50, startDate: "2026-01-15", endDate: "2026-09-30", createdAt: "2026-01-10" },
  { id: "a3", projectId: "pr1", personId: "p10", assignmentRole: AssignmentRole.LEAD_CONSULTANT, allocatedHoursPerWeek: 28, allocationPercent: 70, startDate: "2026-01-15", endDate: "2026-09-30", createdAt: "2026-01-10" },
  { id: "a4", projectId: "pr1", personId: "p15", assignmentRole: AssignmentRole.CONTRIBUTOR, allocatedHoursPerWeek: 16, allocationPercent: 40, startDate: "2026-02-01", endDate: "2026-07-31", createdAt: "2026-01-15" },
  { id: "a5", projectId: "pr1", personId: "p20", assignmentRole: AssignmentRole.EXTERNAL, allocatedHoursPerWeek: 8, allocationPercent: 33, startDate: "2026-03-01", endDate: "2026-06-30", notes: "SAP technikai konzultáció", createdAt: "2026-02-15" },

  // PR2 - MOL SAP S/4HANA Migráció (ACTIVE)
  { id: "a6", projectId: "pr2", personId: "p1", assignmentRole: AssignmentRole.SPONSOR, allocatedHoursPerWeek: 6, allocationPercent: 15, startDate: "2025-10-01", endDate: "2026-12-31", createdAt: "2025-09-15" },
  { id: "a7", projectId: "pr2", personId: "p3", assignmentRole: AssignmentRole.PROJECT_MANAGER, allocatedHoursPerWeek: 8, allocationPercent: 20, startDate: "2025-10-01", endDate: "2026-12-31", notes: "Megosztott PM szerep", createdAt: "2025-09-15" },
  { id: "a8", projectId: "pr2", personId: "p20", assignmentRole: AssignmentRole.LEAD_CONSULTANT, allocatedHoursPerWeek: 16, allocationPercent: 67, startDate: "2025-10-01", endDate: "2026-12-31", notes: "Dedikált SAP lead", createdAt: "2025-09-15" },
  { id: "a9", projectId: "pr2", personId: "p12", assignmentRole: AssignmentRole.CONTRIBUTOR, allocatedHoursPerWeek: 16, allocationPercent: 40, startDate: "2026-01-01", endDate: "2026-06-30", notes: "Adat migráció támogatás", createdAt: "2025-12-15" },

  // PR3 - Magyar Telekom Ügyfélélmény Stratégia (NEGOTIATION)
  { id: "a10", projectId: "pr3", personId: "p2", assignmentRole: AssignmentRole.SPONSOR, allocatedHoursPerWeek: 4, allocationPercent: 10, startDate: "2026-04-01", endDate: "2026-08-31", createdAt: "2026-01-10" },
  { id: "a11", projectId: "pr3", personId: "p9", assignmentRole: AssignmentRole.PROJECT_MANAGER, allocatedHoursPerWeek: 20, allocationPercent: 50, startDate: "2026-04-01", endDate: "2026-08-31", createdAt: "2026-01-10" },
  { id: "a12", projectId: "pr3", personId: "p8", assignmentRole: AssignmentRole.LEAD_CONSULTANT, allocatedHoursPerWeek: 28, allocationPercent: 70, startDate: "2026-04-01", endDate: "2026-08-31", createdAt: "2026-01-10" },
  { id: "a13", projectId: "pr3", personId: "p18", assignmentRole: AssignmentRole.CONTRIBUTOR, allocatedHoursPerWeek: 20, allocationPercent: 50, startDate: "2026-04-01", endDate: "2026-08-31", createdAt: "2026-02-01" },

  // PR4 - Richter Supply Chain (WON)
  { id: "a14", projectId: "pr4", personId: "p1", assignmentRole: AssignmentRole.SPONSOR, allocatedHoursPerWeek: 4, allocationPercent: 10, startDate: "2026-04-15", endDate: "2026-10-31", createdAt: "2026-01-20" },
  { id: "a15", projectId: "pr4", personId: "p9", assignmentRole: AssignmentRole.PROJECT_MANAGER, allocatedHoursPerWeek: 16, allocationPercent: 40, startDate: "2026-04-15", endDate: "2026-10-31", createdAt: "2026-01-20" },
  { id: "a16", projectId: "pr4", personId: "p5", assignmentRole: AssignmentRole.LEAD_CONSULTANT, allocatedHoursPerWeek: 28, allocationPercent: 70, startDate: "2026-04-15", endDate: "2026-10-31", createdAt: "2026-01-20" },
  { id: "a17", projectId: "pr4", personId: "p16", assignmentRole: AssignmentRole.CONTRIBUTOR, allocatedHoursPerWeek: 20, allocationPercent: 50, startDate: "2026-04-15", endDate: "2026-10-31", createdAt: "2026-02-01" },

  // PR6 - Audi Lean Manufacturing (ACTIVE)
  { id: "a18", projectId: "pr6", personId: "p1", assignmentRole: AssignmentRole.SPONSOR, allocatedHoursPerWeek: 4, allocationPercent: 10, startDate: "2025-11-01", endDate: "2026-07-31", createdAt: "2025-09-01" },
  { id: "a19", projectId: "pr6", personId: "p9", assignmentRole: AssignmentRole.PROJECT_MANAGER, allocatedHoursPerWeek: 16, allocationPercent: 40, startDate: "2025-11-01", endDate: "2026-07-31", createdAt: "2025-09-01" },
  { id: "a20", projectId: "pr6", personId: "p5", assignmentRole: AssignmentRole.LEAD_CONSULTANT, allocatedHoursPerWeek: 24, allocationPercent: 60, startDate: "2025-11-01", endDate: "2026-07-31", createdAt: "2025-09-01" },
  { id: "a21", projectId: "pr6", personId: "p7", assignmentRole: AssignmentRole.CONTRIBUTOR, allocatedHoursPerWeek: 12, allocationPercent: 30, startDate: "2026-01-01", endDate: "2026-07-31", createdAt: "2025-12-15" },

  // PR7 - Vodafone AI Chatbot (SUBMITTED)
  { id: "a22", projectId: "pr7", personId: "p1", assignmentRole: AssignmentRole.SPONSOR, allocatedHoursPerWeek: 2, allocationPercent: 5, startDate: "2026-05-01", endDate: "2026-10-31", createdAt: "2026-02-01" },
  { id: "a23", projectId: "pr7", personId: "p6", assignmentRole: AssignmentRole.LEAD_CONSULTANT, allocatedHoursPerWeek: 28, allocationPercent: 70, startDate: "2026-05-01", endDate: "2026-10-31", createdAt: "2026-02-01" },
  { id: "a24", projectId: "pr7", personId: "p22", assignmentRole: AssignmentRole.EXTERNAL, allocatedHoursPerWeek: 12, allocationPercent: 75, startDate: "2026-05-01", endDate: "2026-10-31", notes: "AI/ML fejlesztés", createdAt: "2026-02-01" },

  // PR9 - Tesco Költségoptimalizálás (COMPLETED)
  { id: "a25", projectId: "pr9", personId: "p2", assignmentRole: AssignmentRole.SPONSOR, allocatedHoursPerWeek: 4, allocationPercent: 10, startDate: "2025-06-01", endDate: "2025-12-31", createdAt: "2025-04-01" },
  { id: "a26", projectId: "pr9", personId: "p19", assignmentRole: AssignmentRole.PROJECT_MANAGER, allocatedHoursPerWeek: 28, allocationPercent: 70, startDate: "2025-06-01", endDate: "2025-12-31", createdAt: "2025-04-01" },
  { id: "a27", projectId: "pr9", personId: "p4", assignmentRole: AssignmentRole.LEAD_CONSULTANT, allocatedHoursPerWeek: 28, allocationPercent: 70, startDate: "2025-06-01", endDate: "2025-12-31", createdAt: "2025-04-01" },
  { id: "a28", projectId: "pr9", personId: "p17", assignmentRole: AssignmentRole.CONTRIBUTOR, allocatedHoursPerWeek: 20, allocationPercent: 50, startDate: "2025-07-01", endDate: "2025-12-31", createdAt: "2025-06-01" },

  // PR11 - Wizz Air Operációs Hatékonyság (NEGOTIATION)
  { id: "a29", projectId: "pr11", personId: "p2", assignmentRole: AssignmentRole.SPONSOR, allocatedHoursPerWeek: 4, allocationPercent: 10, startDate: "2026-05-01", endDate: "2026-09-30", createdAt: "2026-01-25" },
  { id: "a30", projectId: "pr11", personId: "p9", assignmentRole: AssignmentRole.PROJECT_MANAGER, allocatedHoursPerWeek: 20, allocationPercent: 50, startDate: "2026-05-01", endDate: "2026-09-30", createdAt: "2026-01-25" },
  { id: "a31", projectId: "pr11", personId: "p5", assignmentRole: AssignmentRole.LEAD_CONSULTANT, allocatedHoursPerWeek: 16, allocationPercent: 40, startDate: "2026-05-01", endDate: "2026-09-30", createdAt: "2026-01-25" },

  // PR13 - Coca-Cola Data Analytics (WON)
  { id: "a32", projectId: "pr13", personId: "p1", assignmentRole: AssignmentRole.SPONSOR, allocatedHoursPerWeek: 4, allocationPercent: 10, startDate: "2026-04-01", endDate: "2026-08-31", createdAt: "2025-12-15" },
  { id: "a33", projectId: "pr13", personId: "p19", assignmentRole: AssignmentRole.PROJECT_MANAGER, allocatedHoursPerWeek: 24, allocationPercent: 60, startDate: "2026-04-01", endDate: "2026-08-31", createdAt: "2025-12-15" },
  { id: "a34", projectId: "pr13", personId: "p6", assignmentRole: AssignmentRole.LEAD_CONSULTANT, allocatedHoursPerWeek: 24, allocationPercent: 60, startDate: "2026-04-01", endDate: "2026-08-31", createdAt: "2025-12-15" },
  { id: "a35", projectId: "pr13", personId: "p12", assignmentRole: AssignmentRole.CONTRIBUTOR, allocatedHoursPerWeek: 16, allocationPercent: 40, startDate: "2026-04-01", endDate: "2026-08-31", createdAt: "2026-01-01" },
  { id: "a36", projectId: "pr13", personId: "p22", assignmentRole: AssignmentRole.EXTERNAL, allocatedHoursPerWeek: 8, allocationPercent: 50, startDate: "2026-04-01", endDate: "2026-06-30", notes: "ML modell fejlesztés", createdAt: "2026-01-01" },

  // PR15 - Ericsson Agile Transzformáció (ACTIVE)
  { id: "a37", projectId: "pr15", personId: "p1", assignmentRole: AssignmentRole.SPONSOR, allocatedHoursPerWeek: 4, allocationPercent: 10, startDate: "2025-12-01", endDate: "2026-08-31", createdAt: "2025-10-15" },
  { id: "a38", projectId: "pr15", personId: "p3", assignmentRole: AssignmentRole.PROJECT_MANAGER, allocatedHoursPerWeek: 8, allocationPercent: 20, startDate: "2025-12-01", endDate: "2026-08-31", notes: "Heti 1 nap oversight", createdAt: "2025-10-15" },
  { id: "a39", projectId: "pr15", personId: "p15", assignmentRole: AssignmentRole.LEAD_CONSULTANT, allocatedHoursPerWeek: 24, allocationPercent: 60, startDate: "2025-12-01", endDate: "2026-08-31", createdAt: "2025-10-15" },
  { id: "a40", projectId: "pr15", personId: "p7", assignmentRole: AssignmentRole.CONTRIBUTOR, allocatedHoursPerWeek: 12, allocationPercent: 30, startDate: "2026-01-01", endDate: "2026-08-31", notes: "Change management", createdAt: "2025-11-15" },
  { id: "a41", projectId: "pr15", personId: "p14", assignmentRole: AssignmentRole.CONTRIBUTOR, allocatedHoursPerWeek: 16, allocationPercent: 40, startDate: "2026-02-01", endDate: "2026-08-31", createdAt: "2026-01-15" },

  // PR14 - Magyar Posta Szervezeti Átalakítás (ON_HOLD)
  { id: "a42", projectId: "pr14", personId: "p2", assignmentRole: AssignmentRole.SPONSOR, allocatedHoursPerWeek: 4, allocationPercent: 10, startDate: "2026-09-01", endDate: "2027-03-31", createdAt: "2025-10-01" },
  { id: "a43", projectId: "pr14", personId: "p19", assignmentRole: AssignmentRole.PROJECT_MANAGER, allocatedHoursPerWeek: 24, allocationPercent: 60, startDate: "2026-09-01", endDate: "2027-03-31", createdAt: "2025-10-01" },
  { id: "a44", projectId: "pr14", personId: "p7", assignmentRole: AssignmentRole.LEAD_CONSULTANT, allocatedHoursPerWeek: 20, allocationPercent: 50, startDate: "2026-09-01", endDate: "2027-03-31", createdAt: "2025-10-01" },

  // PR19 - Dreher Employer Branding (COMPLETED)
  { id: "a45", projectId: "pr19", personId: "p2", assignmentRole: AssignmentRole.SPONSOR, allocatedHoursPerWeek: 2, allocationPercent: 5, startDate: "2025-08-01", endDate: "2026-01-31", createdAt: "2025-06-15" },
  { id: "a46", projectId: "pr19", personId: "p19", assignmentRole: AssignmentRole.PROJECT_MANAGER, allocatedHoursPerWeek: 24, allocationPercent: 60, startDate: "2025-08-01", endDate: "2026-01-31", createdAt: "2025-06-15" },
  { id: "a47", projectId: "pr19", personId: "p14", assignmentRole: AssignmentRole.LEAD_CONSULTANT, allocatedHoursPerWeek: 24, allocationPercent: 60, startDate: "2025-08-01", endDate: "2026-01-31", createdAt: "2025-06-15" },

  // PR12 - CIG Pannónia Digitális Platform (PROPOSAL)
  { id: "a48", projectId: "pr12", personId: "p1", assignmentRole: AssignmentRole.SPONSOR, allocatedHoursPerWeek: 2, allocationPercent: 5, startDate: "2026-06-01", endDate: "2027-02-28", createdAt: "2026-02-10" },
  { id: "a49", projectId: "pr12", personId: "p3", assignmentRole: AssignmentRole.PROJECT_MANAGER, allocatedHoursPerWeek: 20, allocationPercent: 50, startDate: "2026-06-01", endDate: "2027-02-28", createdAt: "2026-02-10" },
  { id: "a50", projectId: "pr12", personId: "p10", assignmentRole: AssignmentRole.LEAD_CONSULTANT, allocatedHoursPerWeek: 24, allocationPercent: 60, startDate: "2026-06-01", endDate: "2027-02-28", createdAt: "2026-02-10" },

  // Extra assignments
  { id: "a51", projectId: "pr4", personId: "p4", assignmentRole: AssignmentRole.CONTRIBUTOR, allocatedHoursPerWeek: 16, allocationPercent: 40, startDate: "2026-04-15", endDate: "2026-10-31", createdAt: "2026-03-01" },
  { id: "a52", projectId: "pr13", personId: "p4", assignmentRole: AssignmentRole.REVIEWER, allocatedHoursPerWeek: 8, allocationPercent: 20, startDate: "2026-04-01", endDate: "2026-08-31", notes: "Pénzügyi review", createdAt: "2026-01-01" },
  { id: "a53", projectId: "pr6", personId: "p16", assignmentRole: AssignmentRole.CONTRIBUTOR, allocatedHoursPerWeek: 12, allocationPercent: 30, startDate: "2026-01-01", endDate: "2026-07-31", createdAt: "2025-12-15" },
  { id: "a54", projectId: "pr3", personId: "p13", assignmentRole: AssignmentRole.CONTRIBUTOR, allocatedHoursPerWeek: 16, allocationPercent: 40, startDate: "2026-04-01", endDate: "2026-08-31", createdAt: "2026-02-01" },
  { id: "a55", projectId: "pr11", personId: "p21", assignmentRole: AssignmentRole.EXTERNAL, allocatedHoursPerWeek: 12, allocationPercent: 60, startDate: "2026-05-01", endDate: "2026-09-30", notes: "Compliance review", createdAt: "2026-02-01" },
];
