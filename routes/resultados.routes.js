const { Router } = require("express");
const router = Router();
const resultadosCtrl = require("../controllers/resultados.controller");

router.get("/resultados", resultadosCtrl.resultados);
router.get("/resultados/ventasMes", resultadosCtrl.totalVendidoMes);
router.get("/resultados/comprasMes", resultadosCtrl.totalProd);
router.get("/resultados/bonif", resultadosCtrl.totalBonif);
router.get("/resultados/cementoMeses", resultadosCtrl.cementoMeses);
router.get("/resultados/ventaMeses", resultadosCtrl.ventaMeses);

module.exports = router;
