import { Handler } from "express";
import { prisma } from "../../prisma/database";
import { CreateLeadRequestSchema } from "./schemas/LeadsRequestSchemas";
import { group } from "console";
import { HttpError } from "../errors/HttpError";

export class LeadsController {
  // Aqui podemos criar os métodos que irão lidar com as requisições
  // relacionadas aos leads, como criar, listar, atualizar e deletar leads.

  // Exemplo de método para listar todos os leads
  index: Handler = async (req, res, next) => {
    // usando o try-catch para lidar com o erro de forma personalizada
    try {
      const leads = await prisma.lead.findMany();
      res.status(200).json(leads);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);
      const newLead = await prisma.lead.create({
        data: body,
      });
      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          groups: true,
          campaigns: true,
        },
      });

      if (!lead) throw new HttpError(404, "Lead not found");

      res.status(200).json(lead);
    } catch (error) {
      next(error);
    }
  };
}
