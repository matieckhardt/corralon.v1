const { Router } = require("express");
const router = Router();
const lpreCtrl = require("../controllers/listaPrecios.controller");

router.get("/listaPrecios", lpreCtrl.index);



module.exports = router;
