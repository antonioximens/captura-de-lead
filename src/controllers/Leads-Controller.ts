import { Handler } from "express";
import { CreateLeadRequestSchema } from "./schemas/LeadsRequestSchemas";
import { LeadsRequestUpdateSchema } from "./schemas/LeadsRequestUpdateSchema";
import { GetLeadsRequestSchemas } from "./schemas/GetLeadsRequestSchema";
import { LeadsService } from "../Service/LeadsService";

// Controller que lida com as operações de CRUD de Leads
export class LeadsController {
  constructor(private readonly leadsService: LeadsService ) { }

  /**
   * Lista todos os leads cadastrados no banco de dados.
   * Método usado no endpoint: GET /leads
   */
  index: Handler = async (req, res, next) => {
    try {
      const query = GetLeadsRequestSchemas.parse(req.query); // valida os dados do getleadschema.ts
      const {page = "1", pageSize = "10"} = query
      const data = await this.leadsService.getAllLeads({...query, page: +page, pageSize: +pageSize}) 

      // traz todo resultado do LeadsService.ts
      res.status(200).json(data);
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
      const body = CreateLeadRequestSchema.parse(req.body);
      // chamando o metodo do leadsService para criar
      const newLead = await this.leadsService.createLead(body)

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
      const lead = await this.leadsService.findLeadId(+req.params.id)
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
      const id = Number(req.params.id);
      const body = LeadsRequestUpdateSchema.parse(req.body);
      const updatedLead = await this.leadsService.updateLead(id, body)
      res.json(updatedLead);
    } catch (error) {
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
      const id = Number(req.params.id);
      const deletedLead = await this.leadsService.deletedLead(id)
      res.json(deletedLead);
    } catch (error) {
      next(error);
    }
  };
}
