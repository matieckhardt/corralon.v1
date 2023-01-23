const resultadosCtrl = {};
const Resultados = require("../models/Resultados");
const Compras = require("../models/Compras");
const Ventas = require("../models/Ventas");
const Comprobantes = require("../models/Comprobantes");
const Pagos = require("../models/Pagos");
const Rubro = require("../models/Rubro");

const day = new Date().getDay();
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();
const anioMesRegex = `${year}-${month.toString().padStart(2, "0")}`;
const anio = `${year.toString().padStart(2, "0")}`;

// suma todo los totales de las ventas del mes

resultadosCtrl.totalVendidoMes = async (req, res) => {
  try {
    let ac = 0;
    const data = await Ventas.find({
      fecha: { $regex: new RegExp(anio) },
    });
    const meses = data.map(({ fecha, precioTotal, presupuesto }) => ({
      Mes: new Date(fecha).toLocaleString("es-ar", { month: "short" }),
      precioTotal: precioTotal,
      presupuesto,
    }));
    const venta = meses.filter(function (element) {
      return element.presupuesto === false;
    });
    const julio = venta.filter(function (element) {
      return element.Mes === "jul";
    });
    const sumas = venta.reduce(
      (a, { Mes, precioTotal }) => ((a[Mes] = (a[Mes] || 0) + +precioTotal), a),
      {}
    );
    return sumas;
  } catch (error) {
    return res.status(404).json(error);
  }
};

resultadosCtrl.totalBonif = async (req, res) => {
  try {
    let ac = 0;
    const data = await Comprobantes.find({
      fechaComp: { $regex: new RegExp(anio) },
    });
    const meses = data.map(({ createdAt, descuentos }) => ({
      Mes: new Date(createdAt).toLocaleString("es-ar", { month: "short" }),
      descuentos,
    }));
    const sumas = meses.reduce(
      (a, { Mes, descuentos }) => ((a[Mes] = (a[Mes] || 0) + +descuentos), a),
      {}
    );
    return sumas;
  } catch (error) {
    return res.status(404).json(error);
  }
};

resultadosCtrl.totalProductivos = async (req, res) => {
  try {
    let ac = 0;
    const data = await Compras.find({
      fechaFc: { $regex: new RegExp(anio) },
    });
    const productivos = data.filter(
      ({ tipoProveedor }) => tipoProveedor == "Productivo"
    );

    const meses = productivos.map(({ fechaFc, montoTotal }) => ({
      Mes: new Date(fechaFc).toLocaleString("es-ar", { month: "short" }),
      montoTotal,
    }));
    const sumas = meses.reduce(
      (a, { Mes, montoTotal }) => ((a[Mes] = (a[Mes] || 0) + +montoTotal), a),
      {}
    );
    return sumas;
  } catch (error) {
    return res.status(404).json(error);
  }
};
resultadosCtrl.totalNoProductivos = async (req, res) => {
  try {
    let ac = 0;
    const data = await Compras.find({
      fechaFc: { $regex: new RegExp(anio) },
    });
    const noProductivos = data.filter(
      ({ tipoProveedor }) => tipoProveedor == "No Productivo"
    );

    const meses = noProductivos.map(({ fechaFc, montoTotal }) => ({
      Mes: new Date(fechaFc).toLocaleString("es-ar", { month: "short" }),
      montoTotal,
    }));
    const sumas = meses.reduce(
      (a, { Mes, montoTotal }) => ((a[Mes] = (a[Mes] || 0) + +montoTotal), a),
      {}
    );
    return sumas;
  } catch (error) {
    return res.status(404).json(error);
  }
};

resultadosCtrl.resultadosJson = async (req, res) => {
  try {
    const ventas = await resultadosCtrl.totalVendidoMes();
    const boni = await resultadosCtrl.totalBonif();
    const productivos = await resultadosCtrl.totalProductivos();
    const noProductivos = await resultadosCtrl.totalNoProductivos();

    const a = Object.entries(ventas).map((e) => ({ [e[0]]: e[1] }));
    const b = Object.entries(boni).map((e) => ({ [e[0]]: e[1] }));
    const c = Object.entries(productivos).map((e) => ({ [e[0]]: e[1] }));
    const d = Object.entries(noProductivos).map((e) => ({ [e[0]]: e[1] }));

    const arrayOfObj = a.concat(b).concat(c).concat(d);

    res.json({ ventas, boni, productivos, noProductivos });
  } catch (error) {
    return res.status(404).json(error);
  }
};

resultadosCtrl.resultados = async (req, res) => {
  try {
    res.render("resultados", {
      active: { resultados: true },
    });
  } catch (error) {
    return res.status(404).json(error);
  }
};

module.exports = resultadosCtrl;
