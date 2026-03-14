export enum DocumentType {
  PROPOSAL_SLIDE = "proposal_slide",
  CONTRACT = "contract",
  REPORT = "report",
  OTHER = "other",
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  name: string;
  type: DocumentType;
  url?: string;           // OneDrive/SharePoint link
  fileData?: string;      // Base64 for local uploads (demo)
  fileName?: string;
  fileSize?: number;
  uploadedBy: string;     // person name
  uploadedAt: string;
  notes?: string;
}

export interface OneDriveLink {
  id: string;
  projectId: string;
  label: string;
  url: string;
  addedBy: string;
  addedAt: string;
}

export interface PersonEvaluation {
  id: string;
  personId: string;
  projectId: string;       // which project this evaluation relates to
  evaluatorId: string;     // who evaluated
  rating: number;          // 1-5
  strengths: string;
  improvements: string;
  comments: string;
  period: string;          // e.g. "2026 Q1"
  createdAt: string;
}

export const DocumentTypeLabels: Record<DocumentType, string> = {
  [DocumentType.PROPOSAL_SLIDE]: "Ajánlati slide",
  [DocumentType.CONTRACT]: "Szerződés",
  [DocumentType.REPORT]: "Riport",
  [DocumentType.OTHER]: "Egyéb",
};
