const { Router } = require("express");
const router = Router();
const migraCtrl = require("../controllers/migra.controller");

router.get("/migra/materialMigra", migraCtrl.materialMigra);
router.get("/migra/clientesMigra", migraCtrl.clientesMigra);
router.get("/migra/ventasMigra", migraCtrl.ventasMigraSinGen);
router.get("/migra/ventasMigraGen", migraCtrl.ventasMigraGen);
router.get("/migra/acopiosMigra", migraCtrl.acopiosMigra);
router.get("/migra/rubrosMigra", migraCtrl.rubrosMigra);
router.get("/migra/proveedoresMigra", migraCtrl.proveedoresMigra);
router.get("/migra/productosMigra", migraCtrl.productosMigra);
router.get("/migra/comprasMigra", migraCtrl.comprasMigra);

module.exports = router;
