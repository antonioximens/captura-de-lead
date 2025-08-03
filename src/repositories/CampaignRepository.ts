import { Campaign } from "@prisma/client"

export type LeadCampaignStatus = "New" | "Engaged" | "FolloUp_Scheduled" | "Contacted" | "Qualified" | "Converted" | "Unresponsive" | "Disqualified" | "Re_Engaged" | "Opted_Out"

export interface CreateCampaign {
    name: string
    description: string 
    startDate: Date 
    endDate?: Date
}

export interface AddLeadToCampaign {
    campaignId: number
    leadId: number
    status: LeadCampaignStatus
}

export interface CampaignRepository{
    find: () => Promise<Campaign[]>
    findById: (id: number) => Promise<Campaign | null>
    create: (attributes:CreateCampaign) => Promise<Campaign>
    update: (id:number, attributes: Partial<CreateCampaign>) => Promise<Campaign | null>
    delete: (id: number) => Promise<Campaign | null>
    addLead: (attributes: AddLeadToCampaign ) => Promise<void>
    updateLead: (attributes: AddLeadToCampaign ) => Promise<void>
    removeLead: (campaignId: number, leadId: number ) => Promise<void>
}