import { Campaign } from "@prisma/client"

export interface CreateCampaign {
    name: string
    description: string 
    startDate: Date 
    endDate?: Date
}

export interface CampaignRepository{
    find: () => Promise<Campaign[]>
    findById: (id: number) => Promise<Campaign | null>
    create: (attributes:CreateCampaign) => Promise<Campaign>
    update: (id:number, attributes: Partial<CreateCampaign>) => Promise<Campaign | null>
    delete: (id: number) => Promise<Campaign | null>
}