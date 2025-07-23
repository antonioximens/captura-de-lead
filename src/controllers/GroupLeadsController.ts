import { Handler } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/database";
import { GetLeadsRequestSchemas } from "./schemas/GetLeadsRequestSchema";
import { AddLeadRequestSchema } from "./schemas/GetCampaignLeadsRequest";


// Cria a classe de controller que vai lidar com leads dentro de um grupo
export class GroupLeadsController {

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
        sorteBy = "name", 
        order = "asc",
      } = query;

      // Converte strings para números
      const pageNumber = Number(page);
      const pageSizeNumber = Number(pageSize);

      // Calcula o valor de "skip" (pular registros para paginação)
      const skipPage = (pageNumber - 1) * pageSizeNumber;

      // Cria o filtro base: leads que pertencem ao grupo
      const where: Prisma.LeadWhereInput = {
        groups: { some: { id: groupId } },
      };

      // Se veio o filtro por nome, adiciona no WHERE
      if (name) {
        where.name = { contains: name, mode: "insensitive" }; // busca parcial e sem case-sensitive
      }

      // Se veio o status, adiciona no WHERE
      if (status) {
        where.status = status;
      }

      // Busca os leads com base nos filtros e paginação
      const leads = await prisma.lead.findMany({
        where,
        orderBy: { [sorteBy]: order }, // ordenação dinâmica (ex: por nome ou por data)
        skip: skipPage,                // pula registros conforme página atual
        take: pageSizeNumber,          // quantos registros por página
        include: {
          groups: true                 // inclui os grupos a que o lead pertence
        },
      });

      // Conta total de registros com os filtros aplicados (para a paginação)
      const total = await prisma.lead.count({ where });

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
      const body = AddLeadRequestSchema.parse(req.body);

      // Atualiza o grupo para conectar o lead (muitos-para-muitos)
      const updatedGroup = await prisma.group.update({
        where: {
          id: Number(req.params.groupId),
        },
        data: {
          leads: {
            connect: { id: body.leadId }, // conecta lead existente ao grupo
          },
        },
        include: { leads: true }, // retorna os leads atualizados no grupo
      });

      // Responde com o grupo atualizado
      res.status(201).json(updatedGroup);

    } catch (error) {
      next(error);
    }
  };

  // Método DELETE: remover um lead de um grupo
  removeLead: Handler = async (req, res, next) => {
    try {
      const updatedGroup = await prisma.group.update({
        where: { id: Number(req.params.groupId) },
        data: {
          leads: {
            disconnect: { id: Number(req.params.leadId) }, // remove a relação com o lead
          },
        },
        include: { leads: true }, // retorna o grupo atualizado
      });

      res.json(updatedGroup);

    } catch (error) {
      next(error);
    }
  };
}
