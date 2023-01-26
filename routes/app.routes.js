const { Router } = require("express");
//const verifyToken = require('../middlewares/AAverifyToken');
const router = Router();
const dashboardCtrl = require("../controllers/dashboard.controller");
const resultadosCtrl = require("../controllers/resultados.controller");
const clientRoutes = require("./clients.routes");
const usersRoutes = require("./users.routes");
const abmRoutes = require("./abm.routes");
const proveedoresRoutes = require("./proveedores.routes");
const productosRoutes = require("./productos.routes");
const comprasRoutes = require("./compras.routes");
const materialRoutes = require("./materiales.routes");
const listaPreciosRoutes = require("./listaPrecios.routes");
const pagosRoutes = require("./pagos.routes");
const ventasRoutes = require("./ventas.routes");
const acopiosRoutes = require("./acopios.routes");
const remitosRoutes = require("./remitos.routes");
const presupuestosRoutes = require("./presupuestos.routes");
const comprobantesRoutes = require("./comprobantes.routes");
const dashboardRoutes = require("./dashboard.routes");
const resultadosRoutes = require("./resultados.routes");
const authRoutes = require("./auth.routes");
const reportsRoutes = require("./reports.routes");

const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/login", dashboardCtrl.login);

//MIDDLEWARE TOKEN
// router.use(verifyToken);

router.use(clientRoutes);
router.use(usersRoutes);
router.use(reportsRoutes);
router.use(abmRoutes);
router.use(authRoutes);
router.use(proveedoresRoutes);
router.use(productosRoutes);
router.use(materialRoutes);
router.use(listaPreciosRoutes);
router.use(comprasRoutes);
router.use(ventasRoutes);
router.use(acopiosRoutes);
router.use(pagosRoutes);
router.use(comprobantesRoutes);
router.use(remitosRoutes);
router.use(presupuestosRoutes);
router.use(dashboardRoutes);
router.use(resultadosRoutes);
router.get("/", dashboardCtrl.dashboard);
router.get("/dashboard/:year/:month", authMiddleware, dashboardCtrl.dashboard);

module.exports = router;
