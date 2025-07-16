import { Handler } from "express";
import { prisma } from "../../prisma/database";
import { HttpError } from "../errors/HttpError";
import {
  CreateSchemaCampaign,
  UpdateSchemaCampaign,
} from "./schemas/CreateCampaign";

export class CampaignsController {
  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await prisma.campaign.findMany();
      res.status(200).json(campaigns);
    } catch (error) {
      next(error);
    }
  };
  show: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
          leads: true,
        },
      });

      if (!campaign) throw new HttpError(404, "Campanha não encontrada");
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateSchemaCampaign.parse(req.body);

      const newCampaign = await prisma.campaign.create({ data: body });
      res.status(201).json(newCampaign);
    } catch (error) {
      next(error);
    }
  };
  update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const body = UpdateSchemaCampaign.parse(req.body);
      const campaignExists = await prisma.campaign.findUnique({
        where: { id },
      });
      if (!campaignExists)
        throw new HttpError(404, "Campanha não encontrada para atualização");
      const updatedCampaign = await prisma.campaign.update({
        where: { id },
        data: body,
      });

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
      const id = Number(req.params.id);
      const campaignExists = await prisma.campaign.findFirst({
        where: { id },
        select: { id: true },
      });
      if (!campaignExists)
        throw new HttpError(404, "campanha não encontrada para exclusão");
      const deletedCampaign = await prisma.campaign.delete({ where: { id } });

      res.status(200).json({
        message: "Campanha excluída com sucesso",
        data: deletedCampaign,
      });
    } catch (error) {
      next(error);
    }
  };
}
