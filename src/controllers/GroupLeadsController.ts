import { Handler } from "express";
import { GetLeadsRequestSchemas } from "./schemas/GetLeadsRequestSchema";
import { AddLeadRequestSchema } from "./schemas/GetCampaignLeadsRequest";
import { GroupsRepository } from "../repositories/GroupsRepository";
import {
  LeadsRepository,
  LeadWhereParams,
} from "../repositories/LeadsRepository";

// Cria a classe de controller que vai lidar com leads dentro de um grupo
export class GroupLeadsController {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly leadsRepository: LeadsRepository
  ) {}

  // Método GET: buscar todos os leads de um grupo com paginação e filtros
  getLeads: Handler = async (req, res, next) => {
    try {
      // Pega o ID do grupo da URL e transforma para número
      const groupId = Number(req.params.groupId);

      // Valida e transforma a query string da URL usando Zod
      const query = GetLeadsRequestSchemas.parse(req.query);

      // Extrai os campos da query com valores padrão caso não venham
      const {
        page = "1",
        pageSize = "10",
        name,
        status,
        sortBy = "name",
        order = "asc",
      } = query;

      // Converte strings para números
      const pageNumber = Number(page);
      const pageSizeNumber = Number(pageSize);

      // Calcula o valor de "skip" (pular registros para paginação)
      const skipPage = (pageNumber - 1) * pageSizeNumber;

      // Cria o filtro base: leads que pertencem ao grupo
      const where: LeadWhereParams = {
        groupId,
      };

      // Se veio o filtro por nome, adiciona no WHERE
      if (name) {
        where.name = { like: name, mode: "insensitive" }; // busca parcial e sem case-sensitive
      }

      // Se veio o status, adiciona no WHERE
      if (status) {
        where.status = status;
      }

      // Busca os leads com base nos filtros e paginação
      const leads = await this.leadsRepository.find({
        where,
        sortBy,
        order,
        limit: pageSizeNumber,
        offset: skipPage,
        include: {groups: true}
      });

      // Conta total de registros com os filtros aplicados (para a paginação)
      const total = await this.leadsRepository.count(where);

      // Retorna os dados no formato padrão de paginação
      res.json({
        leads,
        meta: {
          page: pageNumber,
          pageSize: pageSizeNumber,
          total,
          totalPages: Math.ceil(total / pageSizeNumber), // total de páginas
        },
      });
    } catch (error) {
      // Em caso de erro, passa para o middleware de tratamento de erro
      next(error);
    }
  };

  // Método POST: adicionar um lead ao grupo
  addLead: Handler = async (req, res, next) => {
    try {
      // Valida e transforma o corpo da requisição
      const groupId = Number(req.params.id);
      const { leadId } = AddLeadRequestSchema.parse(req.body);

      // Atualiza o grupo para conectar o lead (muitos-para-muitos)
      const updatedGroup = await this.groupsRepository.addLeadToGroup(
        groupId,
        leadId
      );
      // Responde com o grupo atualizado
      res.status(201).json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  // Método DELETE: remover um lead de um grupo
  removeLead: Handler = async (req, res, next) => {
    try {
      const groupId = Number(req.params.groupId);
      const leadId = Number(req.params.leadId);

      const updatedGroup = await this.groupsRepository.removeLeadToGroup(
        groupId,
        leadId
      );
      res.json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };
}
