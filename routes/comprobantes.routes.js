const { Router } = require("express");
const router = Router();
const comprobantesCtrl = require("../controllers/comprobantes.controller");

router.get("/comprobantes", comprobantesCtrl.index);
router.get("/comprobantes/:list", comprobantesCtrl.listComprobantes);
router.get("/comprobantes/find/:id", comprobantesCtrl.getComprobantes);
router.post("/comprobantes/create", comprobantesCtrl.createComprobantes);
router.put("/comprobantes/edit/:id", comprobantesCtrl.editComprobantes);
router.delete("/comprobantes/delete/:id", comprobantesCtrl.deleteComprobantes);

module.exports = router;
