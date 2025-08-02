import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import {
  CreateSchemaCampaign,
  UpdateSchemaCampaign,
} from "./schemas/CreateCampaign";
import { CampaignRepository } from "../repositories/CampaignRepository";

export class CampaignsController {
  constructor(private readonly campaignRepository: CampaignRepository){}

  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await this.campaignRepository.find()
      res.status(200).json(campaigns);
    } catch (error) {
      next(error);
    }
  };
  show: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const campaign = await this.campaignRepository.findById(id)
    
      if (!campaign) throw new HttpError(404, "Campanha não encontrada");
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateSchemaCampaign.parse(req.body);

      const newCampaign = await this.campaignRepository.create(body)
      res.status(201).json(newCampaign);
    } catch (error) {
      next(error);
    }
  };
  update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const body = UpdateSchemaCampaign.parse(req.body);
      
      const updatedCampaign = await this.campaignRepository.update(id, body)
      if (!updatedCampaign)
        throw new HttpError(404, "Campanha não encontrada para atualização");

      res.status(200).json({
        message: "Campanha atualizada com sucesso",
        data: updatedCampaign,
      });
    } catch (error) {
      next(error);
    }
  };
  delete: Handler = async (req, res, next) => {
    try { 

      const deletedCampaign = await this.campaignRepository.delete(Number(req.params.id))
      if (!deletedCampaign)
        throw new HttpError(404, "campanha não encontrada para exclusão");

      res.status(200).json({
        message: "Campanha excluída com sucesso",
        data: deletedCampaign,
      });
    } catch (error) {
      next(error);
    }
  };
}
