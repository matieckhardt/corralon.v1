const { Router } = require("express");
const router = Router();
const dashboardCtrl = require("../controllers/dashboard.controller");

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;

router.get("/dashboard/tiposCompro", dashboardCtrl.tiposCompro);
router.get("/dashboard/metodoPago", dashboardCtrl.metodoPago);
router.get("/dashboard/cementos", dashboardCtrl.cementos);

module.exports = router;
