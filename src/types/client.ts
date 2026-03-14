import { Industry } from "./project";

export interface Client {
  id: string;
  name: string;
  industry: Industry;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  website?: string;
  taxNumber?: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
