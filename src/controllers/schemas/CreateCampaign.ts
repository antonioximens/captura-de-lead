import { z } from "zod";

// criação de campanha
export const CreateSchemaCampaign = z.object({
    name: z.string(),
    description: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional()
})

// atualização de campanha
export const UpdateSchemaCampaign = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional()
})


