import { LeadsController } from "./controllers/Leads-Controller";
import { GroupsController } from "./controllers/GroupsController";
import { CampaignsController } from "./controllers/CampaignsController";
import { CampaignLeadsController } from "./controllers/CampaignLeadsController";
import { GroupLeadsController } from "./controllers/GroupLeadsController";
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository";
import { PrismaGroupsRepository } from "./repositories/prisma/PrismaGroupsRepository";
import { PrismaCampaignRepository } from "./repositories/prisma/PrismaCampaignRepository";

// instanciando repositorios
export const leadsRepository = new PrismaLeadsRepository()
export const groupsRepository = new PrismaGroupsRepository()
export const campaignRepository = new PrismaCampaignRepository()

// criados na classe e usar - lo
export const leadsController = new LeadsController(leadsRepository)
export const groupsController = new GroupsController(groupsRepository)
export const campaignController = new CampaignsController(campaignRepository)
export const campaignLeadsController = new CampaignLeadsController()
export const groupLeadsController = new GroupLeadsController(groupsRepository, leadsRepository)
