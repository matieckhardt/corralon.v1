const dashboardCtrl = {};
const Dashboard = require("../models/Dashboard");
const Compras = require("../models/Compras");
const Pagos = require("../models/Pagos");
const Ventas = require("../models/Ventas");
const filterYearMonth = require("../helpers/filterYearMonth");

dashboardCtrl.login = async (req, res) => {
  res.render("login", { layout: "login" });
};

const dashboardData = async (req, res) => {
  const year = parseInt(req.year);
  const month = parseInt(req.month) - 1;

  // total Vendido

  const totalVendido = await Ventas.aggregate([
    {
      $match: { ...filterYearMonth(year), presupuesto: false },
    },
    {
      $group: {
        _id: null,
        totalVendido: {
          $sum: "$precioTotal",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalVendido: 1,
      },
    },
  ]);

  //total Vendido MES

  const totalVendidoMes = await Ventas.aggregate([
    {
      $match: { ...filterYearMonth(year, month), presupuesto: false },
    },
    {
      $group: {
        _id: null,
        totalVendido: {
          $sum: "$precioTotal",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalVendido: 1,
      },
    },
  ]);

  // mejores clientes

  const mejoresClientes = await Ventas.aggregate([
    {
      $match: {
        ...filterYearMonth(year),
        cliente: {
          $nin: ["Cliente Generico", "Generico"],
        },
        presupuesto: false,
      },
    },
    {
      $project: {
        cliente: 1,
        precioTotal: 1,
      },
    },
    {
      $group: {
        _id: "$cliente",
        totalVendido: {
          $sum: "$precioTotal",
        },
      },
    },
    {
      $project: {
        _id: 0,
        cliente: "$_id",
        totalVendido: 1,
      },
    },
    {
      $sort: {
        totalVendido: -1,
      },
    },
  ]);

  // Mejores clientes Mes

  const mejoresClientesMes = await Ventas.aggregate([
    {
      $match: {
        ...filterYearMonth(year, month),
        cliente: {
          $nin: ["Cliente Generico", "Generico"],
        },
        presupuesto: false,
      },
    },
    {
      $project: {
        cliente: 1,
        precioTotal: 1,
      },
    },
    {
      $group: {
        _id: "$cliente",
        totalVendido: {
          $sum: "$precioTotal",
        },
      },
    },
    {
      $project: {
        _id: 0,
        cliente: "$_id",
        totalVendido: 1,
      },
    },
    {
      $sort: {
        totalVendido: -1,
      },
    },
  ]);

  //////////

  const totalCompradoMes = await Compras.aggregate([
    {
      $match: filterYearMonth(year, month),
    },
    {
      $group: {
        _id: null,
        totalComprado: {
          $sum: "$montoTotal",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalComprado: 1,
      },
    },
  ]);
  ////////

  const totalComprado = await Compras.aggregate([
    {
      $match: filterYearMonth(year),
    },
    {
      $group: {
        _id: null,
        totalComprado: {
          $sum: "$montoTotal",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalComprado: 1,
      },
    },
  ]);

  ///////

  const mejoresProveedores = await Compras.aggregate([
    {
      $match: filterYearMonth(year),
    },
    {
      $project: {
        proveedor: 1,
        montoTotal: 1,
      },
    },
    {
      $group: {
        _id: "$proveedor",
        totalComprado: {
          $sum: "$montoTotal",
        },
      },
    },
    {
      $project: {
        _id: 0,
        proveedor: "$_id",
        totalComprado: 1,
      },
    },
    {
      $sort: {
        totalComprado: -1,
      },
    },
  ]);

  //////

  const mejoresProveedoresMes = await Compras.aggregate([
    {
      $match: filterYearMonth(year, month),
    },
    {
      $project: {
        proveedor: 1,
        montoTotal: 1,
      },
    },
    {
      $group: {
        _id: "$proveedor",
        totalComprado: {
          $sum: "$montoTotal",
        },
      },
    },
    {
      $project: {
        _id: 0,
        proveedor: "$_id",
        totalComprado: 1,
      },
    },
    {
      $sort: {
        totalComprado: -1,
      },
    },
  ]);

  //////// RANKING

  const bestProd = await Ventas.find({
    fecha: { $regex: new RegExp(year) },
  }).select("materialesVendidos.mercaderia materialesVendidos.cantidad");
  const mateMasVen = bestProd.flatMap(
    ({ materialesVendidos }) => materialesVendidos
  );
  const groupBy = (x, f) =>
    x.reduce((a, b) => ((a[f(b)] ||= []).push(b), a), {});
  const grupo = groupBy(mateMasVen, (v) => v.mercaderia);
  const merCant = Object.keys(grupo)
    .map((key) => {
      return grupo[key];
    })
    .flat()
    .reduce(
      (a, { cantidad, mercaderia }) => (
        (a[mercaderia] = (a[mercaderia] || 0) + +cantidad), a
      ),
      {}
    );
  const ordenados = Object.entries(merCant).sort(([, a], [, b]) => b - a);
  var arrayAux = [];
  const algo = ordenados.map((elemento) =>
    arrayAux.push({ Nombre: elemento[0], Cantidad: elemento[1] })
  );
  const ranking = arrayAux.slice(0, 5);

  const cementosVendidos = await Ventas.aggregate([
    {
      $match: { ...filterYearMonth(year, month), presupuesto: false },
    },
    {
      $project: {
        _id: 0,
        "materialesVendidos.mercaderia": 1,
        "materialesVendidos.cantidad": 1,
      },
    },
    {
      $unwind: {
        path: "$materialesVendidos",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$materialesVendidos.mercaderia",
        cantidad: {
          $sum: {
            $toDecimal: "$materialesVendidos.cantidad",
          },
        },
      },
    },
    {
      $match: {
        _id: {
          $regex: new RegExp("emento"),
        },
      },
    },
    {
      $group: {
        _id: "cementosVendidos",
        cantidad: {
          $sum: "$cantidad",
        },
      },
    },
    {
      $project: {
        _id: 0,
        cantidad: 1,
      },
    },
  ]);

  //// Data DASHBOARD
  try {
    const data = {
      cementos: cementosVendidos[0].cantidad || { cementos: 0 },
      vendidoAño: totalVendido[0].totalVendido || { clienteAño: 0 },
      vendidoMes: totalVendidoMes[0].totalVendido || { vendidoMes: 0 },
      clienteAño: mejoresClientes[0] || {
        totalVendido: 0,
        cliente: "No hay ventas",
      },
      clienteMes: mejoresClientesMes[0] || {
        totalVendido: 0,
        cliente: "No hay ventas",
      },
      proveedorAño: mejoresProveedores[0] || {
        totalComprado: 0,
        proveedor: "No hubo compras",
      },
      proveedorMes: mejoresProveedoresMes[0] || {
        totalComprado: 0,
        proveedor: "No hubo compras",
      },
      compradoMes: totalCompradoMes[0] || { totalComprado: 0 },
      compradoAño: totalComprado[0].totalComprado || { comprado: 0 },
      ranking: ranking || { Nombre: "Vacio", Cantidad: 0 },
    };
    console.log(data);
    return data;
  } catch (error) {
    return res.status(error).json(error);
  }
};

dashboardCtrl.dashboard = async (req, res) => {
  try {
    const dash = await dashboardData(req.params);
    res.render("dashboard", { Valores: dash });
  } catch (error) {
    return res.status(404).json(error);
  }
};

dashboardCtrl.tiposCompro = async (req, res) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  try {
    const tiposCompro = await Ventas.aggregate([
      {
        $match: filterYearMonth(year, month),
      },
      {
        $group: {
          _id: "$comprobante",
          cantidad: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          tipo: "$_id",
          cantidad: 1,
        },
      },
      {
        $sort: {
          cantidad: -1,
        },
      },
    ]);

    const comprobantes = tiposCompro.map(({ cantidad }) => cantidad);
    return res.json(comprobantes);
  } catch (error) {
    return res.status(404).json(error);
  }
};

dashboardCtrl.metodoPago = async (req, res) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  try {
    const pagos = await Pagos.aggregate([
      {
        $match: filterYearMonth(year, month),
      },
      {
        $group: {
          _id: "$metodoDePago",
          cantidad: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          metodoPago: "$_id",
          cantidad: 1,
        },
      },
    ]);

    const metodoPago = pagos.map(({ cantidad }) => cantidad);

    return res.json(metodoPago);
  } catch (error) {
    return res.status(404).json(error);
  }
};

dashboardCtrl.cementos = async (req, res) => {
  try {
    const cementosVendidos = await Ventas.aggregate([
      {
        $match: { ...filterYearMonth(year, month), presupuesto: false },
      },
      {
        $project: {
          _id: 0,
          "materialesVendidos.mercaderia": 1,
          "materialesVendidos.cantidad": 1,
        },
      },
      {
        $unwind: {
          path: "$materialesVendidos",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$materialesVendidos.mercaderia",
          cantidad: {
            $sum: {
              $toDecimal: "$materialesVendidos.cantidad",
            },
          },
        },
      },
      {
        $match: {
          _id: {
            $regex: new RegExp("emento"),
          },
        },
      },
      {
        $group: {
          _id: "cementosVendidos",
          cantidad: {
            $sum: "$cantidad",
          },
        },
      },
      {
        $project: {
          _id: 0,
          cantidad: 1,
        },
      },
    ]);

    return res.json(cementosVendidos);
  } catch (error) {
    return res.status(error).json(error);
  }
};

module.exports = dashboardCtrl;
