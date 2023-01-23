const { Router } = require("express");
const router = Router();

const { getUsers, postUser } = require("../controllers/user.controller");

router.get("/", getUsers);
router.post("/", postUser);

module.exports = router;
