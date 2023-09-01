const { Router } = require("express");
const router = Router();
const mateCtrl = require("../controllers/materiales.controller");

router.get("/materiales", mateCtrl.index);
router.get("/materiales/list", mateCtrl.listMaterial);
router.get("/materiales/listMigra", mateCtrl.listMigra);
router.get("/materiales/find/:id", mateCtrl.getMaterial);
router.post("/materiales/create", mateCtrl.createMaterial);
router.put("/materiales/edit/:id", mateCtrl.editMaterial);
router.delete("/materiales/delete/:id", mateCtrl.deleteMaterial);

module.exports = router;
