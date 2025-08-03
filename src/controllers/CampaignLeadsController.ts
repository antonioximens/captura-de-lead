import { Handler } from "express";
import { Prisma } from "@prisma/client";
import {
  AddLeadRequestSchema,
  GetCampaignLeadsRequestSchemas,
  UpdateLeadStatusRequestSchema
} from "./schemas/GetCampaignLeadsRequest";
import { prisma } from "../../prisma/database";
import { CampaignRepository } from "../repositories/CampaignRepository";

export class CampaignLeadsController {

  constructor( private readonly campaignRepository: CampaignRepository){}
  /**
   * GET /campaigns/:campaignId/leads
   * - Recebe query params: page, pageSize, name, status, sortBy, order
   * - Retorna página de leads vinculados a uma campanha
   */
  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId);
      // Validação e parsing da query
      const query = GetCampaignLeadsRequestSchemas.parse(req.query);
      const {
        page = "1",
        pageSize = "10",
        name,
        status,
        sortBy = "name",
        order = "asc"
      } = query;

      const pageNumber = Number(page);
      const pageSizeNumber = Number(pageSize);

      // Filtro inicial: leads já associados à campanha
      const where: Prisma.LeadWhereInput = {
        campaigns: { some: { campaignId } }
      };

      // Filtro adicional por nome
      if (name) {
        where.name = { contains: name, mode: "insensitive" };
      }

      // Filtro adicional por status no join com leadCampaign
      if (status) {
        where.campaigns = { some: { status } };
      }

      // Busca os leads com paginação e ordenação
      const leads = await prisma.lead.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
        include: {
          campaigns: {
            select: {
              campaignId: true,
              leadId: true,
              status: true
            }
          }
        }
      });

      // Conta total de registros com os filtros aplicados
      const total = await prisma.lead.count({ where });

      res.json({
        leads,
        meta: {
          page: pageNumber,
          pageSize: pageSizeNumber,
          total,
          totalPages: Math.ceil(total / pageSizeNumber)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /campaigns/:campaignId/leads
   * - Body com { leadId, status }
   * - Insere associação entre lead e campanha
   */
  addLead: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const {leadId, status = "New"} = AddLeadRequestSchema.parse(req.body);
      await this.campaignRepository.addLead({campaignId, leadId, status});
      res.status(201).end();
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /campaigns/:campaignId/leads/:leadId
   * - Body com { status }
   * - Atualiza o status da associação lead ↔ campanha
   */
  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const leadId = Number(req.params.leadId)
      const campaignId = Number(req.params.campaignId)
      const {status} = UpdateLeadStatusRequestSchema.parse(req.body);
      await this.campaignRepository.updateLead({campaignId, leadId, status })
      res.status(204).json({ message: "status do Lead atualizado com sucesso"});
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /campaigns/:campaignId/leads/:leadId
   * - Remove associação entre lead e campanha
   */
  removeLead: Handler = async (req, res, next) => {
    try {
      const leadId = Number(req.params.leadId)
      const campaignId = Number(req.params.campaignId)
      await this.campaignRepository.removeLead(campaignId, leadId)
      res.json({ message: "Lead removido da campanha com sucesso "})
    } catch (error) {
      next(error);
    }
  };
}