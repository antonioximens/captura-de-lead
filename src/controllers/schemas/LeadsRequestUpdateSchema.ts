// Fazendo a validação para atualizar os leads

import { z } from "zod";

export const LeadsRequestUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  status: z
    .enum([
      "New",
      "Contacted",
      "Qualified",
      "Converted",
      "Unresponsive",
      "Disqualified",
      "Archived",
    ])
    .optional(),
  groups: z.array(z.number()).optional(), // Array of group IDs
  campaigns: z.array(z.number()).optional(), // Array of campaign IDs
});
