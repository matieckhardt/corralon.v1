const { Router } = require("express");
const router = Router();
const abmCtrl = require("../controllers/abm.controller");

router.get("/users", abmCtrl.index);
router.get("/users/list", abmCtrl.listUsers);
router.post("/users/create", abmCtrl.createUser);
router.put("/users/edit/:id", abmCtrl.editUser);
router.delete("/users/delete/:id", abmCtrl.deleteUser);

module.exports = router;
