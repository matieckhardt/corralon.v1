const { Router } = require("express");
const router = Router();
const authCtrl = require("../controllers/auth.controller");

router.post("/signin", authCtrl.handleLogin);
//router.post("/signup", authCtrl.signUp);
//router.post("/logout", authCtrl.logOut);

module.exports = router;
