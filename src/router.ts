// rotas da aplicação

import { Router } from "express";
import { LeadsController } from "./controllers/Leads-Controller";
import { GroupsController } from "./controllers/GroupsController";

// cria um roteador para por as rotas da aplicação
const router = Router();

// cria uma instnacia de leadsController para usar os metodos
// criados na classe e usar - lo
const leadsController = new LeadsController()
const groupsController = new GroupsController()

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

// Rota de teste para verificar se esta ok
router.get("/test", (req, res) => {
  res.json({ message: "OK" });
});

export { router };
