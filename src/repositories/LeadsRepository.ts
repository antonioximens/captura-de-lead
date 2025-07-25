import { Lead } from "@prisma/client";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Converted"
  | "Unresponsive"
  | "Disqualified"
  | "Archived";

export interface LeadWhereParams {
  name?: {
    like?: string;
    equals?: string;
    mode: "default" | "insensitive";
  };
  status?: LeadStatus;
}

export interface FindLeadsParams {
  where?: LeadWhereParams;
}

export interface LeadsRepository {
  find: (params: FindLeadsParams) => Promise<Lead>;
  findByIdLead: (id: number) => Promise<Lead | null>;
  countLead: () => Promise<Lead>;
  createLead: () => Promise<Lead>;
  updateLead: () => Promise<Lead>;
  deleteLead: () => Promise<Lead>;
}
