import { Handler } from "express";
import { prisma } from "../../prisma/database";
import { HttpError } from "../errors/HttpError";
import { CreateSchemaCapaign } from "./schemas/CreateCampaign";

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
      const body = CreateSchemaCapaign.parse(req.body);

      const newCampaign = await prisma.campaign.create({ data: body });
      res.status(201).json(newCampaign);
    } catch (error) {
      next(error);
    }
  };
  update: Handler = async (req, res, next) => {};
  delete: Handler = async (req, res, next) => {};
}
