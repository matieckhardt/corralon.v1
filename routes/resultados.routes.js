const { Router } = require("express");
const router = Router();
const resultadosCtrl = require("../controllers/resultados.controller");

router.get("/resultados", resultadosCtrl.resultados);
router.get("/resultados/ventasMes", resultadosCtrl.totalVendidoMes);
router.get("/resultados/comprasMes", resultadosCtrl.totalProd);
router.get("/resultados/bonif", resultadosCtrl.totalBonif);

module.exports = router;
