const { Router } = require("express");
const router = Router();
const comprasCtrl = require("../controllers/compras.controller");

router.get("/compras", comprasCtrl.index);
router.get("/compras/:list", comprasCtrl.listCompras);
router.get("/compras/find/:id", comprasCtrl.getCompras);
router.post("/compras/create", comprasCtrl.createCompras);
router.put("/compras/edit/:id", comprasCtrl.editCompras);
router.delete("/compras/delete/:id", comprasCtrl.deleteCompras);

module.exports = router;
