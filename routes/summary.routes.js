const { Router } = require("express");
const summaryCtrl = require("../controllers/summary.controller");

const summaryRouter = Router();

summaryRouter
  .param("year", (req, res, next, value) => {
    const parsed = parseInt(value);
    if (isNaN(parsed) || parsed < 0) {
      res.status(400).json({
        error: `${value} is not a valid year.`,
      });
      return;
    } else {
      if (req.dateParams === undefined) {
        req.dateParams = {};
      }
      req.dateParams.year = parsed;
      next();
    }
  })
  .param("month", (req, res, next, value) => {
    const parsed = parseInt(value);
    if (isNaN(parsed) || !(value >= 1 && value <= 12)) {
      res.status(400).json({
        error: `${value} is not a valid month.`,
      });
      return;
    } else {
      if (req.dateParams === undefined) {
        req.dateParams = {};
      }
      req.dateParams.month = parsed - 1;
      next();
    }
  })
  .get("/metodosPago", summaryCtrl.metodosPago) // ok
  .get("/tiposComprobante", summaryCtrl.tiposComprobante) //ok
  .get("/:year/productosVendidos", summaryCtrl.productosVendidos) // ok
  .get("/:year/:month/productosVendidos", summaryCtrl.productosVendidos) //ok
  .get("/:year/totalVendido", summaryCtrl.totalVendido) //OK
  .get("/:year/:month/totalVendido", summaryCtrl.totalVendido) //ok
  .get("/:year/mejoresClientes", summaryCtrl.mejoresClientes) //ok
  .get("/:year/:month/mejoresClientes", summaryCtrl.mejoresClientes) //ok
  .get("/:year/productosComprados", summaryCtrl.productosComprados) //OK
  .get("/:year/:month/productosComprados", summaryCtrl.productosComprados) //ok
  .get("/:year/totalComprado", summaryCtrl.totalComprado) //ok
  .get("/:year/:month/totalComprado", summaryCtrl.totalComprado) //ok
  .get("/:year/mejoresProveedores", summaryCtrl.mejoresProveedores) //ok
  .get("/:year/:month/mejoresProveedores", summaryCtrl.mejoresProveedores); //ok

module.exports = summaryRouter;
