const { Router } = require("express");
const router = Router();
const ventasCtrl = require("../controllers/ventas.controller");

router.get("/ventas", ventasCtrl.index);
router.get("/ventas/:fecha", ventasCtrl.listVentas);
router.get("/ventas/find/:id", ventasCtrl.getVentas);
router.get("/ventas/get/:id", ventasCtrl.getVenta);
router.post("/ventas/create", ventasCtrl.createVentas);
router.put("/ventas/edit/:id", ventasCtrl.editVentas);
router.delete("/ventas/delete/:id", ventasCtrl.deleteVentas);

module.exports = router;
