// rotas da aplicação
import { Router } from "express";
import { campaignController, campaignLeadsController, groupLeadsController, groupsController, leadsController } from "./container";

// cria um roteador para por as rotas da aplicação
const router = Router();



// Define as rotas para os leads
router.get("/leads", leadsController.index)
router.get("/leads/:id", leadsController.show)
router.post("/leads", leadsController.create)
router.put("/leads/:id", leadsController.update);
router.delete("/leads/:id", leadsController.delete);

router.get("/groups", groupsController.index)
router.post("/groups", groupsController.create)
router.get("/groups/:id", groupsController.show)
router.put("/groups/:id", groupsController.update)
router.delete("/groups/:id", groupsController.delete)

router.get("/api/campaigns", campaignController.index)
router.post("/api/campaigns", campaignController.create)
router.get("/api/campaigns/:id", campaignController.show)
router.put("/api/campaigns/:id", campaignController.update)
router.delete("/api/campaigns/:id", campaignController.delete)

router.get("/campaigns/:campaignId/leads", campaignLeadsController.getLeads)
router.post("/campaigns/:campaignId/leads", campaignLeadsController.addLead)
router.put("/campaigns/:campaignId/leads/:leadId", campaignLeadsController.updateLeadStatus)
router.delete("/campaigns/:campaignId/leads/:leadId", campaignLeadsController.removeLead)


router.get("/groups/:groupId/leads", groupLeadsController.getLeads)
router.post("/groups/:groupId/leads", groupLeadsController.addLead)
router.delete("/groups/:groupId/leads/:leadId", groupLeadsController.removeLead)
// Rota de teste para verificar se esta ok
router.get("/test", (req, res) => {
  res.json({ message: "OK" });
});

export { router };
