import { z } from "zod";

// criação de campanha
export const CreateSchemaCampaign = z.object({
  name: z.string(),
  description: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
});

// atualização de campanha
export const UpdateSchemaCampaign = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
