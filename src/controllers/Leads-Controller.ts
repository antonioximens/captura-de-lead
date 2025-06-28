import { Handler } from "express";
import { prisma } from "../../prisma/database";
import { CreateLeadRequestSchema } from "./schemas/LeadsRequestSchemas";
import { HttpError } from "../errors/HttpError";
import { LeadsRequestUpdateSchema } from "./schemas/LeadsRequestUpdateSchema";

// Controller que lida com as operações de CRUD de Leads
export class LeadsController {
  /**
   * Lista todos os leads cadastrados no banco de dados.
   * Método usado no endpoint: GET /leads
   */
  index: Handler = async (req, res, next) => {
    try {
      const leads = await prisma.lead.findMany();
      res.status(200).json(leads);
    } catch (error) {
      next(error); // encaminha erro para o middleware global
    }
  };

  /**
   * Cria um novo lead no banco de dados.
   * Valida os dados de entrada usando o schema definido com zod.
   * Endpoint: POST /leads
   */
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body); // valida body
      const newLead = await prisma.lead.create({ data: body });
      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retorna os dados de um lead específico com base no ID passado na URL.
   * Inclui também as relações com grupos e campanhas.
   * Endpoint: GET /leads/:id
   */
  show: Handler = async (req, res, next) => {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          groups: true,
          campaigns: true,
        },
      });

      if (!lead) throw new HttpError(404, "Lead não encontrado para exibição");

      res.status(200).json(lead);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Atualiza um lead existente com os dados enviados no body.
   * Também valida os dados com zod antes de atualizar.
   * Endpoint: PUT /leads/:id
   */
  update: Handler = async (req, res, next) => {
    try {
      const body = LeadsRequestUpdateSchema.parse(req.body); // valida os dados
      const leadUpdated = await prisma.lead.update({
        where: { id: Number(req.params.id) },
        data: body,
        include: {
          groups: true,
          campaigns: true,
        },
      });

      res.status(200).json(leadUpdated);
    } catch (error: any) {
      // Prisma lança esse erro se o ID informado não existir
      if (error.code === "P2025") {
        return next(new HttpError(404, "Lead não encontrado para atualização"));
      }
      next(error);
    }
  };

  /**
   * Deleta um lead com base no ID fornecido na URL.
   * Retorna o lead deletado como resposta.
   * Endpoint: DELETE /leads/:id
   */
  delete: Handler = async (req, res, next) => {
    try {
      const leadDeleted = await prisma.lead.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(leadDeleted);
    } catch (error: any) {
      if (error.code === "P2025") {
        return next(new HttpError(404, "Lead não encontrado para exclusão"));
      }
      next(error);
    }
  };
}
