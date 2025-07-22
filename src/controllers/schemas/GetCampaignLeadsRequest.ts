import { z } from "zod";

const LeadCampaignStatusSchema = z.enum([
  "New",
  "Engaged",
  "Contacted",
  "Qualified",
  "Converted",
  "Unresponsive",
  "Disqualified",
  "Re_Engaged",
  "Opted_Out"
])

export const GetCampaignLeadsRequestSchemas = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  name: z.string().optional(),
  status: LeadCampaignStatusSchema.optional(),
  sortBy: z.enum(["name", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const AddLeadRequestSchema = z.object({
  leadId: z.number(),
  status: LeadCampaignStatusSchema.optional()
})

export const UpdateLeadStatusRequestSchema = z.object({
  status: LeadCampaignStatusSchema
})