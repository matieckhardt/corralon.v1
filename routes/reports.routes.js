const { Router } = require("express");
const router = Router();
const reportsCtrl = require("../controllers/reports.controller");

router.get("/reports", reportsCtrl.reports);
router.get("/reports/openingBalance", reportsCtrl.openingBalance);
router.get("/reports/purchases/prod", reportsCtrl.purchasesProd);
router.get("/reports/purchases/noProd", reportsCtrl.purchasesNoProd);
router.get("/reports/purchases/taxes", reportsCtrl.purchasesTaxes);
router.get("/reports/discountMonth", reportsCtrl.discountMonth);

module.exports = router;
