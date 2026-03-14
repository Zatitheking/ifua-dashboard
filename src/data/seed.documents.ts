import { type ProjectDocument, type OneDriveLink, type PersonEvaluation, DocumentType } from "../types/document";

export const seedDocuments: ProjectDocument[] = [
  { id: "doc1", projectId: "pr1", name: "OTP Digitális Transzformáció — Ajánlat v2.1", type: DocumentType.PROPOSAL_SLIDE, fileName: "OTP_DT_Ajanlat_v2.1.pptx", fileSize: 4500000, uploadedBy: "Horváth Ádám", uploadedAt: "2025-12-15", notes: "Végleges ajánlati prezentáció" },
  { id: "doc2", projectId: "pr1", name: "OTP Discovery Fázis Összefoglaló", type: DocumentType.REPORT, fileName: "OTP_Discovery_Summary.pdf", fileSize: 2100000, uploadedBy: "Egervári Balázs", uploadedAt: "2026-02-20" },
  { id: "doc3", projectId: "pr2", name: "MOL SAP Migration — Ajánlat", type: DocumentType.PROPOSAL_SLIDE, fileName: "MOL_SAP_Proposal.pptx", fileSize: 6200000, uploadedBy: "Horváth Ádám", uploadedAt: "2025-09-01", notes: "SAP S/4HANA migráció ajánlat" },
  { id: "doc4", projectId: "pr2", name: "MOL — Szerződés", type: DocumentType.CONTRACT, fileName: "MOL_Contract_2025.pdf", fileSize: 800000, uploadedBy: "Szegedi Zoltán", uploadedAt: "2025-09-25" },
  { id: "doc5", projectId: "pr3", name: "Telekom CX Stratégia Ajánlat", type: DocumentType.PROPOSAL_SLIDE, fileName: "Telekom_CX_Proposal.pptx", fileSize: 5100000, uploadedBy: "Neumann-Toró Krisztina", uploadedAt: "2026-01-15" },
  { id: "doc6", projectId: "pr4", name: "Richter Supply Chain — Ajánlat", type: DocumentType.PROPOSAL_SLIDE, fileName: "Richter_SC_Proposal.pptx", fileSize: 3800000, uploadedBy: "Gálfi Péter", uploadedAt: "2026-01-28" },
  { id: "doc7", projectId: "pr6", name: "Audi Lean — Értékáram elemzés", type: DocumentType.REPORT, fileName: "Audi_VSM_Report.pdf", fileSize: 1500000, uploadedBy: "Gálfi Péter", uploadedAt: "2026-03-01" },
  { id: "doc8", projectId: "pr15", name: "Ericsson SAFe Bevezetés — Ajánlat", type: DocumentType.PROPOSAL_SLIDE, fileName: "Ericsson_SAFe_Proposal.pptx", fileSize: 4200000, uploadedBy: "Szentkirályi Márton", uploadedAt: "2025-10-20" },
  { id: "doc9", projectId: "pr13", name: "Coca-Cola Data Platform — Ajánlat", type: DocumentType.PROPOSAL_SLIDE, fileName: "CocaCola_Data_Proposal.pptx", fileSize: 3500000, uploadedBy: "Kádas Antal", uploadedAt: "2025-12-20" },
  { id: "doc10", projectId: "pr9", name: "Tesco — Záróriport", type: DocumentType.REPORT, fileName: "Tesco_FinalReport.pdf", fileSize: 2800000, uploadedBy: "Bacskai Anna", uploadedAt: "2026-01-10", notes: "Projekt lezáró dokumentáció" },
];

export const seedOneDriveLinks: OneDriveLink[] = [
  { id: "od1", projectId: "pr1", label: "OTP Projekt Mappa", url: "https://ifuahorvath.sharepoint.com/sites/OTP-DT/Shared%20Documents", addedBy: "Egervári Balázs", addedAt: "2026-01-15" },
  { id: "od2", projectId: "pr1", label: "OTP Workshop Anyagok", url: "https://ifuahorvath.sharepoint.com/sites/OTP-DT/Workshop", addedBy: "Szabó Péter Gábor", addedAt: "2026-02-01" },
  { id: "od3", projectId: "pr2", label: "MOL SAP Projekt Dokumentáció", url: "https://ifuahorvath.sharepoint.com/sites/MOL-SAP/Documents", addedBy: "Horváth Ádám", addedAt: "2025-10-01" },
  { id: "od4", projectId: "pr2", label: "MOL Technikai Specifikáció", url: "https://ifuahorvath.sharepoint.com/sites/MOL-SAP/TechSpec", addedBy: "Török László", addedAt: "2025-11-15" },
  { id: "od5", projectId: "pr6", label: "Audi Lean Projekt Tér", url: "https://ifuahorvath.sharepoint.com/sites/Audi-Lean", addedBy: "Pregi Miklós", addedAt: "2025-11-10" },
  { id: "od6", projectId: "pr15", label: "Ericsson Agile — Közös Mappa", url: "https://ifuahorvath.sharepoint.com/sites/Ericsson-Agile", addedBy: "Szentkirályi Márton", addedAt: "2025-12-05" },
  { id: "od7", projectId: "pr13", label: "Coca-Cola Analytics Workspace", url: "https://ifuahorvath.sharepoint.com/sites/CocaCola-Data", addedBy: "Kádas Antal", addedAt: "2026-01-05" },
  { id: "od8", projectId: "pr3", label: "Telekom CX — Ajánlati anyagok", url: "https://ifuahorvath.sharepoint.com/sites/Telekom-CX", addedBy: "Neumann-Toró Krisztina", addedAt: "2026-01-12" },
];

export const seedEvaluations: PersonEvaluation[] = [
  { id: "ev1", personId: "p3", projectId: "pr1", evaluatorId: "p1", rating: 5, strengths: "Kiváló projektmenedzsment, hatékony kommunikáció az ügyfél felé", improvements: "Több delegálás a junior tagoknak", comments: "Kiemelkedő teljesítmény az OTP projekten", period: "2026 Q1", createdAt: "2026-03-10" },
  { id: "ev2", personId: "p10", projectId: "pr1", evaluatorId: "p1", rating: 4, strengths: "Mély technikai tudás, jó prezentációs készség", improvements: "Időmenedzsment fejlesztése", comments: "Megbízható lead tanácsadó", period: "2026 Q1", createdAt: "2026-03-10" },
  { id: "ev3", personId: "p5", projectId: "pr6", evaluatorId: "p1", rating: 5, strengths: "Lean Six Sigma szaktudás, ügyfélmenedzsment", improvements: "Riportok részletessége", comments: "Az Audi projekt sikere nagyrészt neki köszönhető", period: "2026 Q1", createdAt: "2026-03-08" },
  { id: "ev4", personId: "p15", projectId: "pr15", evaluatorId: "p1", rating: 4, strengths: "SAFe keretrendszer ismerete, csapat coaching", improvements: "Konfliktuskezelés fejlesztése", comments: "Stabil teljesítmény az Ericsson projekten", period: "2026 Q1", createdAt: "2026-03-08" },
  { id: "ev5", personId: "p9", projectId: "pr6", evaluatorId: "p1", rating: 4, strengths: "Strukturált megközelítés, pontos riportálás", improvements: "Proaktívabb ügyfélérintkezés", comments: "Jó PM munka, az Audi projekt időben halad", period: "2026 Q1", createdAt: "2026-03-05" },
  { id: "ev6", personId: "p4", projectId: "pr9", evaluatorId: "p2", rating: 5, strengths: "Kiváló pénzügyi modellezés, SAP FI/CO szaktudás", improvements: "Prezentációs készségek csiszolása", comments: "A Tesco költségoptimalizálás sikeres volt", period: "2025 Q4", createdAt: "2026-01-10" },
  { id: "ev7", personId: "p14", projectId: "pr15", evaluatorId: "p1", rating: 4, strengths: "HR/Change szaktudás beépítése az agile transzformációba", improvements: "Technikai háttérismeretek bővítése", comments: "Jó synergy a change és az agile között", period: "2026 Q1", createdAt: "2026-03-05" },
  { id: "ev8", personId: "p7", projectId: "pr6", evaluatorId: "p9", rating: 4, strengths: "Change management facilitáció, workshop vezetés", improvements: "Írott dokumentáció minősége", comments: "Hatékonyan kezelte az Audi ellenállási pontjait", period: "2026 Q1", createdAt: "2026-03-01" },
];
