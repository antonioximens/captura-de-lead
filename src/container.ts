import { LeadsController } from "./controllers/Leads-Controller";
import { GroupsController } from "./controllers/GroupsController";
import { CampaignsController } from "./controllers/CampaignsController";
import { CampaignLeadsController } from "./controllers/CampaignLeadsController";
import { GroupLeadsController } from "./controllers/GroupLeadsController";
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository";
import { PrismaGroupsRepository } from "./repositories/prisma/PrismaGroupsRepository";

// instanciando repositorios
export const leadsRepository = new PrismaLeadsRepository()
export const groupsRepository = new PrismaGroupsRepository()
// cria uma instancia de leadsController para usar os metodos
// criados na classe e usar - lo
export const leadsController = new LeadsController(leadsRepository)
export const groupsController = new GroupsController(groupsRepository)
export const campaignController = new CampaignsController()
export const campaignLeadsController = new CampaignLeadsController()
export const groupLeadsController = new GroupLeadsController(groupsRepository, leadsRepository)
