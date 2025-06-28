// rotas da aplicação

import { Router } from "express";
import { LeadsController } from "./controllers/Leads-Controller";

// cria um roteador para por as rotas da aplicação
const router = Router();

// cria uma instnacia de leadsController para usar os metodos
// criados na classe e usar - lo
const leadsController = new LeadsController()

// Define as rotas para os leads
router.get("/leads", leadsController.index)
router.get("/leads/:id", leadsController.show)
router.post("/leads", leadsController.create)
router.put("/leads/:id", leadsController.update);
router.delete("/leads/:id", leadsController.delete);

// Rota de teste para verificar se esta ok
router.get("/test", (req, res) => {
  res.json({ message: "OK" });
});

export { router };
