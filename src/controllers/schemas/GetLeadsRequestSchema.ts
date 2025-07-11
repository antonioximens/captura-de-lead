/** 
 validando os dados de entrada para o endpoint de pesquisa
**/

import z from "zod";

const LeadStatus = z.enum([
    "New",
    "Contacted",
    "Qualified",
    "Converted",
    "Unresponsive",
    "Disqualified",
    "Archived",
  ])

export const GetLeadsRequestSchemas = z.object ({
    page: z.string().optional() ,
    pageSize: z.string().optional() ,
    name: z.string().optional() ,
    status: LeadStatus.optional() ,
    sorteBy: z.enum(["name", "status"]).optional(),
    order: z.enum(["asc", "desc"]).optional()
})