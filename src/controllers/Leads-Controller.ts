import { Handler } from "express";
import { prisma } from "../../prisma/database";
import { CreateLeadRequestSchema } from "./schemas/LeadsRequestSchemas";
import { HttpError } from "../errors/HttpError";
import { LeadsRequestUpdateSchema } from "./schemas/LeadsRequestUpdateSchema";
import { GetLeadsRequestSchemas } from "./schemas/GetLeadsRequestSchema";
import { Prisma } from "@prisma/client";

// Controller que lida com as operações de CRUD de Leads
export class LeadsController {
  /**
   * Lista todos os leads cadastrados no banco de dados.
   * Método usado no endpoint: GET /leads
   */
  index: Handler = async (req, res, next) => {
    try {
      const query = GetLeadsRequestSchemas.parse(req.query); // valida os dados do getleadschema.ts
      const {
        name,
        status,
        page = "1",
        pageSize = "10",
        sorteBy = "name",
        order = "asc",
      } = query;

      // convertendo para number
      const pageNumber = Number(page);
      const pageSizeNumber = +pageSize;

      const where: Prisma.LeadWhereInput = {};

      // adicionando filtros dec busca
      if (name) where.name = { contains: name, mode: "insensitive" };
      if (status) where.status = status;

      // fazendo a consulta
      const leads = await prisma.lead.findMany({
        where,
        skip: (pageNumber - 1) * pageSizeNumber, // pular os registros antes de exibir
        take: pageSizeNumber,
        orderBy: { [sorteBy]: order },
      });

      const totalCount = await prisma.lead.count({ where });

      res.status(200).json({
        data: leads,
        meta: {
          totalCount, // total de registros encontrados
          page: pageNumber, // página atual
          pageSize: pageSizeNumber, // tamanho da página
          totalPages: Math.ceil(totalCount / pageSizeNumber), // total de páginas
        },
      });
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
      const body = CreateLeadRequestSchema.parse(req.body)
      // Verifica se o status foi enviado, caso contrário define como "New"
      if (!body.status) body.status = "New"
      // Cria o lead no banco de dados
      const newLead = await prisma.lead.create({
        data: body
      })
      res.status(201).json(newLead)
    } catch (error) {
      next(error)
    }
  }

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
      const id = Number(req.params.id)
      const body = LeadsRequestUpdateSchema.parse(req.body)

      const leadExists = await prisma.lead.findUnique({ where: { id } })
      if (!leadExists) throw new HttpError(404, "lead não encontrado")
      
      // Verifica se o lead já foi devidamente contatado
      if (leadExists.status === "New" && body.status !== "Contacted") {
	      throw new HttpError(400, "um novo lead deve ser contatado antes de ter seu status atualizado para outros valores")
      }
      
      // Valida a inatividade nesse lead em casa de arquivamente
      if (body.status === "Archived") {
	      const now = new Date()
	      const diffTime = Math.abs(now.getTime() - leadExists.updatedAt.getTime())
	      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
	      if (diffDays < 180) throw new HttpError(400, "um lead só pode ser arquivado após 6 meses de inatividade")
      }

      const updatedLead = await prisma.lead.update({ data: body, where: { id } })

      res.json(updatedLead)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deleta um lead com base no ID fornecido na URL.
   * Retorna o lead deletado como resposta.
   * Endpoint: DELETE /leads/:id
   */
   delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id)

      const leadExists = await prisma.lead.findUnique({ where: { id } })
      if (!leadExists) throw new HttpError(404, "lead não encontrado")

      const deletedLead = await prisma.lead.delete({ where: { id } })

      res.json({ deletedLead })
    } catch (error) {
      next(error)
    }
  }
}
