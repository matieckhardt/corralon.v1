const { Router } = require("express");
const router = Router();
const proveedoresCtrl = require("../controllers/proveedores.controller");

router.get("/proveedores/finder/:id", proveedoresCtrl.getProveedor);

router.get("/proveedores", proveedoresCtrl.index);
router.get("/proveedores/list", proveedoresCtrl.listProveedores);
router.get("/proveedores/find/:id", proveedoresCtrl.getProveedores);
router.post("/proveedores/create", proveedoresCtrl.createProveedores);
router.put("/proveedores/edit/:id", proveedoresCtrl.editProveedores);
router.delete("/proveedores/delete/:id", proveedoresCtrl.deleteProveedores);

module.exports = router;
