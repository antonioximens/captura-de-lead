// aqui fazemos a validação dos dados de entrada para as rotas relacionadas a Leads
// dos leads usando a bibliotea do zod

import { z } from "zod";

export const CreateLeadRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  status: z.enum([
    "New",
    "Contacted",
    "Qualified",
    "Converted",
    "Unresponsive",
    "Disqualified",
    "Archived",
  ]).optional()
});
