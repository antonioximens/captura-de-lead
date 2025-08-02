import { Campaign } from "@prisma/client";
import { CampaignRepository, CreateCampaign } from "../CampaignRepository";
import { prisma } from "../../../prisma/database";

export class PrismaCampaignRepository implements CampaignRepository {

    async find(): Promise<Campaign[]>{
        return prisma.campaign.findMany()
    }
    async findById(id: number): Promise<Campaign | null>{
        return prisma.campaign.findUnique({ where: {id}})
    }
    async create(attributes: CreateCampaign): Promise<Campaign>{
        return prisma.campaign.create({data: attributes})
    }
    async update(id: number, attributes: Partial<CreateCampaign>): Promise<Campaign | null>{
        return prisma.campaign.update({
            where: {id},
            data: attributes,
            include: {
                leads: {
                    include: {
                        lead: true
                    }
                }
            }
        })
    }
    async delete(id: number): Promise<Campaign | null>{
        return prisma.campaign.delete({where: {id}})
    }

}